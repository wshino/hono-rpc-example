import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_URL = 'http://localhost:3000';

describe('RPC API E2E Tests', () => {
  let serverProcess: ChildProcess;

  beforeAll(() => {
    // Start the server
    serverProcess = spawn('bun', ['run', 'src/index.ts'], {
      stdio: 'pipe',
      cwd: path.join(__dirname, '..'),
    });

    // Wait for server to start
    return new Promise<void>((resolve) => {
      serverProcess.stdout?.on('data', (data) => {
        if (data.toString().includes('Server is running')) {
          resolve();
        }
      });
    });
  });

  afterAll(() => {
    // Shutdown the server
    serverProcess.kill();
  });

  it('should handle hello method correctly', async () => {
    const response = await fetch(`${SERVER_URL}/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'hello',
        params: { name: 'Test' },
        id: 1,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      jsonrpc: '2.0',
      result: 'Hello, Test!',
      id: 1,
    });
  });

  it('should handle getTime method correctly', async () => {
    const response = await fetch(`${SERVER_URL}/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'getTime',
        params: { timezone: 'UTC' },
        id: 2,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.jsonrpc).toBe('2.0');
    expect(data.id).toBe(2);
    expect(data.result).toHaveProperty('time');
    // Verify the time string format
    expect(typeof data.result.time).toBe('string');
    expect(Date.parse(data.result.time)).not.toBeNaN();
  });

  it('should handle invalid method name', async () => {
    const response = await fetch(`${SERVER_URL}/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'nonexistentMethod',
        params: {},
        id: 3,
      }),
    });

    expect(response.status).toBe(200); // JSON-RPC errors still return 200
    const data = await response.json();
    expect(data).toEqual({
      jsonrpc: '2.0',
      error: {
        code: -32601,
        message: 'Method not found',
      },
      id: 3,
    });
  });

  it('should handle invalid params', async () => {
    const response = await fetch(`${SERVER_URL}/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'hello',
        params: {}, // Missing required 'name' parameter
        id: 4,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.jsonrpc).toBe('2.0');
    expect(data.error).toBeDefined();
    expect(data.error.code).toBe(-32602);
    expect(data.error.message).toBe('Invalid params');
    expect(data.id).toBe(4);
  });
}); 