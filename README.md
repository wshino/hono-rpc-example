# Hono RPC Example

A JSON-RPC 2.0 server implementation using Hono and Bun.

## Features

- JSON-RPC 2.0 compliant server
- Built with Hono and Bun
- TypeScript support
- Zod for request validation
- E2E tests with Vitest
- Docker support for development and production

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine (optional for local development)
- Docker and Docker Compose (recommended)

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd hono-rpc-example
```

### Development

You can choose between two development methods:

#### 1. Docker Development Environment (Recommended)

This method provides a consistent development environment across team members and matches the production environment:

```bash
# Start the development environment
docker compose up app-dev

# Stop the development environment
docker compose down
```

**Features of Docker Development Environment:**
- Live reload: Changes to source files are automatically detected and applied
- Consistent environment: Same environment for all developers
- No local dependencies required: Everything runs in the container
- Volume mounting: Edit files locally, changes reflect in the container
- Dependency isolation: Node modules are managed within the container

**Development Workflow:**
1. Start the development container with `docker compose up app-dev`
2. Edit source files in your preferred editor (changes are synced automatically)
3. Changes trigger automatic server restart
4. Test your changes (server runs on http://localhost:3000)

#### 2. Local Development

If you prefer to develop locally:

```bash
# Install dependencies
bun install

# Start the development server with hot reload
bun run dev
```

### Production

For production deployment:

```bash
# Start production environment
docker compose up app-prod

# Or build and run the production image directly
docker build -t hono-rpc-example .
docker run -p 3000:3000 hono-rpc-example
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

## Project Structure

```
.
├── src/
│   ├── index.ts          # Application entry point
│   ├── rpcRouter.ts      # JSON-RPC router implementation
│   └── handlers/         # RPC method handlers
│       ├── hello.ts
│       └── getTime.ts
├── test/                 # Test files
├── docker-compose.yml    # Docker Compose configuration
└── Dockerfile           # Docker build configuration
```

## Development Guidelines

### Adding New RPC Methods

1. Create a new handler file in `src/handlers/`
2. Implement the handler with Zod validation
3. Add corresponding test file
4. The handler will be automatically loaded by the RPC router

Example handler structure:
```typescript
import { z } from 'zod';

export const schema = z.object({
  // Define your input validation schema
});

export type Params = z.infer<typeof schema>;

export const handler = async (params: Params): Promise<unknown> => {
  // Implement your handler logic
};
```

## License

MIT 