# Hono RPC Example

A JSON-RPC 2.0 server implementation using Hono and Bun.

## Features

- JSON-RPC 2.0 compliant server
- Built with Hono and Bun
- TypeScript support
- Zod for request validation
- E2E tests with Vitest

## Available Methods

- `hello`: Returns a greeting message
- `getTime`: Returns the current time (with optional timezone)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd hono-rpc-example

# Install dependencies
bun install
```

### Development

```bash
# Start the development server with hot reload
bun run dev
```

### Testing

```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch
```

## Example Requests

### Hello Method

```bash
curl -X POST -H "Content-Type: application/json" http://localhost:3000/rpc -d '{
  "jsonrpc": "2.0",
  "method": "hello",
  "params": { "name": "World" },
  "id": 1
}'
```

### GetTime Method

```bash
curl -X POST -H "Content-Type: application/json" http://localhost:3000/rpc -d '{
  "jsonrpc": "2.0",
  "method": "getTime",
  "params": { "timezone": "UTC" },
  "id": 2
}'
```

## License

MIT 