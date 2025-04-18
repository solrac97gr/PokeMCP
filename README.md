# Pokedex MCP

A Pokémon information tool built with the Model Context Protocol (MCP), providing detailed data about Pokémon through a simple interface.

## Overview

This project implements an MCP server that interacts with the [PokéAPI](https://pokeapi.co/) to fetch comprehensive information about Pokémon. It allows LLMs (Large Language Models) to access Pokémon data through the MCP protocol.

## Features

- **Search Pokémon**: Get detailed information about a Pokémon by name
- **Rich Data**: Returns comprehensive details including:
  - Basic stats (ID, name, height, weight, base experience)
  - Types and abilities
  - Stats breakdown
  - Evolution information
  - Habitat and growth rate
  - Capture rate
  - Image URLs (regular and shiny)
- **Dynamic Greeting Resource**: Simple demonstration of MCP resources

## Prerequisites

- Node.js (>= 16.x)
- pnpm (>= 10.8.1)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pokedex-mcp.git
cd pokedex-mcp

# Install dependencies
pnpm install
```

## Usage

### Running the server

```bash
# Run using TypeScript directly
pnpm tsx main.ts

# Or use the debug script for inspection
sh scripts/debug.sh
```

### Interacting with the server

The server implements the Model Context Protocol, so you can interact with it using any MCP-compatible client.

#### Example: Search for a Pokémon

Use the `search_pokemon` tool to get information about a specific Pokémon:

```json
{
  "tool": "search_pokemon",
  "params": {
    "pokemon_name": "pikachu"
  }
}
```

The server will return detailed information about Pikachu, including stats, evolution chain, and more.

## How It Works

This project leverages the MCP SDK to create a server that:

1. Establishes connection through standard I/O
2. Defines a tool for searching Pokémon data
3. Fetches and processes data from multiple PokéAPI endpoints
4. Returns structured information in a format suitable for LLMs

## Project Structure

- `main.ts` - The main server implementation
- `scripts/debug.sh` - Script for running with the MCP inspector
- `package.json` - Project dependencies and metadata

## Dependencies

- `@modelcontextprotocol/sdk`: For implementing the MCP server
- `zod`: For validating input parameters

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using the [Model Context Protocol](https://github.com/llm-tools/modelcontextprotocol)