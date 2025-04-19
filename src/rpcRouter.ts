import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: unknown;
  id: number | string | null;
}

export interface JsonRpcSuccessResponse {
  jsonrpc: '2.0';
  result: unknown;
  id: number | string | null;
}

export interface JsonRpcErrorResponse {
  jsonrpc: '2.0';
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: number | string | null;
}

export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;

interface Handler {
  handler: (params: unknown) => Promise<unknown>;
  schema?: z.ZodType;
}

export class RpcRouter {
  private handlers: Map<string, Handler> = new Map();

  async loadHandlers(handlersDir: string): Promise<void> {
    const files = await fs.readdir(handlersDir);
    
    for (const file of files) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const methodName = path.basename(file, path.extname(file));
        const module = await import(path.join(handlersDir, file));
        
        this.handlers.set(methodName, {
          handler: module.handler,
          schema: module.schema,
        });
      }
    }
  }

  async handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    const { method, params, id } = request;

    // Method not found
    if (!this.handlers.has(method)) {
      return {
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: 'Method not found',
        },
        id,
      };
    }

    const handler = this.handlers.get(method)!;

    // Validate params if schema exists
    if (handler.schema) {
      try {
        handler.schema.parse(params);
      } catch (error) {
        return {
          jsonrpc: '2.0',
          error: {
            code: -32602,
            message: 'Invalid params',
            data: error,
          },
          id,
        };
      }
    }

    try {
      const result = await handler.handler(params);
      return {
        jsonrpc: '2.0',
        result,
        id,
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal error',
          data: error instanceof Error ? error.message : String(error),
        },
        id,
      };
    }
  }
} 