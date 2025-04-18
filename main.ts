import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});

// find pokemon using the poke_api
// - poke api link: https://pokeapi.co/api/v2/pokemon/{pokemon_name}
server.tool("search_pokemon",
  { pokemon_name: z.string() },
  async ({ pokemon_name }) => {
    try {
      // Fetch pokemon data from the API
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_name.toLowerCase()}`);

      if (!response.ok) {
        return {
          content: [{ type: "text", text: `Pokemon '${pokemon_name}' not found.` }]
        };
      }

      const data = await response.json();

      // Fetch species data to get evolution information
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      // Fetch evolution chain data
      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();

      // Process the raw data to include evolution details
      const processEvolutionChain = (chain: any, evolutionInfo: any[] = []) => {
        const pokemonName = chain.species.name;
        const evolutionDetails = chain.evolution_details[0] || {};

        if (evolutionDetails.min_level) {
          evolutionInfo.push(`${pokemonName} evolves at level ${evolutionDetails.min_level}`);
        } else if (Object.keys(evolutionDetails).length > 0) {
          const details = Object.entries(evolutionDetails)
            .filter(([_, value]) => value !== null && value !== "")
            .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
            .join(', ');

          if (details) {
            evolutionInfo.push(`${pokemonName} evolves with: ${details}`);
          }
        }

        if (chain.evolves_to && chain.evolves_to.length > 0) {
          chain.evolves_to.forEach((evolution: any) => {
            processEvolutionChain(evolution, evolutionInfo);
          });
        }

        return evolutionInfo;
      };

      const evolutionInfo = processEvolutionChain(evolutionData.chain);

      // Return the complete Pokemon data
      return {
        content: [{
          type: "text",
          text: `Complete Pokemon Data for ${data.name}:

Basic Info:
- ID: ${data.id}
- Name: ${data.name}
- Height: ${data.height / 10}m
- Weight: ${data.weight / 10}kg
- Base Experience: ${data.base_experience}

Types: ${data.types.map((type: any) => type.type.name).join(', ')}

Abilities: ${data.abilities.map((ability: any) =>
            `${ability.ability.name}${ability.is_hidden ? ' (Hidden)' : ''}`).join(', ')}

Stats:
${data.stats.map((stat: any) => `- ${stat.stat.name}: ${stat.base_stat}`).join('\n')}

Evolution Information:
${evolutionInfo.length > 0 ? evolutionInfo.join('\n') : 'This Pokemon has no evolutions'}

Habitat: ${speciesData.habitat ? speciesData.habitat.name : 'Unknown'}
Growth Rate: ${speciesData.growth_rate.name}
Capture Rate: ${speciesData.capture_rate}

Image URL: ${data.sprites.front_default}
Shiny Image URL: ${data.sprites.front_shiny}

Raw data available for further queries about this Pokemon.`
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching pokemon data: ${error.message}` }]
      };
    }
  }
);


// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
