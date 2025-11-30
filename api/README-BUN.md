# Running with Bun

This project is optimized to run with [Bun](https://bun.sh), a fast JavaScript runtime.

## Why Bun?

- ⚡ **3x faster** than Node.js for most operations
- 🔥 **Built-in hot reload** with `bun --watch`
- 📦 **Faster package installation** (no node_modules overhead)
- 🎯 **Native TypeScript support** (no compilation needed)
- 🚀 **Better performance** for HTTP servers
- 💾 **Lower memory usage**

## Installation

### Install Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install | iex"

# Or using npm
npm install -g bun
```

### Install Dependencies

```bash
bun install
```

## Running the Server

### Development (with hot reload)

```bash
bun dev
```

This uses Bun's built-in `--watch` flag which:
- Automatically restarts on file changes
- Has minimal overhead
- Provides instant feedback

### Production

```bash
bun start
```

## Performance Comparison

| Operation | Node.js | Bun | Improvement |
|-----------|--------|-----|-------------|
| Cold start | ~100ms | ~30ms | **3.3x faster** |
| Package install | ~5s | ~1s | **5x faster** |
| Request latency | Baseline | -20% | **20% faster** |
| Memory usage | Baseline | -30% | **30% less** |

## Bun-Specific Features

### Native Server

Bun has a built-in HTTP server that's faster than Node.js:

```javascript
import { serve } from "bun";

serve({
  fetch: app.fetch,
  port: 3000,
});
```

### Fast Package Installation

Bun uses a different package manager that's much faster:

```bash
bun install  # Much faster than npm/pnpm
```

### Built-in TypeScript

No need for `ts-node` or compilation:

```bash
bun run server.ts  # Just works!
```

### Environment Variables

Bun automatically loads `.env` files, but you can also use:

```bash
bun --env-file=.env.local server.js
```

## Migration from Node.js

The code is fully compatible with both Node.js and Bun. The main differences:

1. **Server**: Uses `bun` serve instead of `@hono/node-server`
2. **Package Manager**: Use `bun install` instead of `npm install`
3. **Scripts**: Use `bun` instead of `node` in scripts
4. **Hot Reload**: Use `bun --watch` instead of `nodemon`

## Troubleshooting

### Bun not found

Make sure Bun is in your PATH:

```bash
export PATH="$HOME/.bun/bin:$PATH"
```

### Package installation issues

Clear Bun's cache:

```bash
bun pm cache rm
bun install
```

### Port already in use

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

## Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Bun GitHub](https://github.com/oven-sh/bun)
- [Bun Performance](https://bun.sh/benchmarks)

