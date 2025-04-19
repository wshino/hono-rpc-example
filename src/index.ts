import { Hono } from 'hono';
import { z } from 'zod';
import { RpcRouter, JsonRpcRequest } from './rpcRouter';
import path from 'path';
import { fileURLToPath } from 'url';

const app = new Hono();
const rpcRouter = new RpcRouter();

// Schema for JSON-RPC request validation
const jsonRpcRequestSchema = z.object({
  jsonrpc: z.literal('2.0'),
  method: z.string(),
  params: z.unknown().optional(),
  id: z.union([z.number(), z.string(), z.null()]),
});

// Get the directory path for handlers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const handlersDir = path.join(__dirname, 'handlers');

// Load all handlers at startup
await rpcRouter.loadHandlers(handlersDir);

app.post('/rpc', async (c) => {
  const body = await c.req.json();

  // Validate JSON-RPC request format
  const parseResult = jsonRpcRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request',
        data: parseResult.error,
      },
      id: null,
    }, 400);
  }

  const request = parseResult.data as JsonRpcRequest;
  const response = await rpcRouter.handleRequest(request);

  // Return 200 status code even for JSON-RPC errors as per spec
  return c.json(response);
});

// Start the server
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch
}; 