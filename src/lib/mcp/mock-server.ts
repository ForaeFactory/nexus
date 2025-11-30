import { MCPServer, Tool, CallToolResult } from "./types";

const MOCK_FILESYSTEM: Record<string, string> = {
  "/README.md": "# Nexus Project\n\nThis is a local-first AI workspace.",
  "/src/index.ts": "console.log('Hello World');",
  "/src/utils.ts": "export const add = (a: number, b: number) => a + b;",
  "/package.json": JSON.stringify({ name: "nexus", version: "1.0.0" }, null, 2),
};

const MOCK_GITHUB_REPOS = [
  { name: "facebook/react", description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.", stars: 200000 },
  { name: "vercel/next.js", description: "The React Framework", stars: 100000 },
  { name: "modelcontextprotocol/sdk", description: "Model Context Protocol SDK", stars: 500 },
];

const MOCK_DB_USERS = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Charlie", role: "user" },
];

export class MockMCPServer implements MCPServer {
  async listTools(): Promise<Tool[]> {
    return [
      {
        name: "list_directory",
        description: "List files in a directory",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Path to directory" },
          },
          required: ["path"],
        },
      },
      {
        name: "read_file",
        description: "Read contents of a file",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Path to file" },
          },
          required: ["path"],
        },
      },
      {
        name: "search_github",
        description: "Search for GitHub repositories",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
          },
          required: ["query"],
        },
      },
      {
        name: "query_postgres",
        description: "Execute a read-only SQL query on the users database",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "SQL query" },
          },
          required: ["query"],
        },
      },
    ];
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<CallToolResult> {
    console.log(`[MockServer] Calling tool: ${name}`, args);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency

    switch (name) {
      case "list_directory": {
        const path = (args.path as string) || "/";
        const files = Object.keys(MOCK_FILESYSTEM).filter((f) => f.startsWith(path));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(files, null, 2),
            },
          ],
        };
      }
      case "read_file": {
        const path = args.path as string;
        const content = MOCK_FILESYSTEM[path];
        if (!content) {
          return {
            content: [{ type: "text", text: `Error: File not found: ${path}` }],
            isError: true,
          };
        }
        return {
          content: [{ type: "text", text: content }],
        };
      }
      case "search_github": {
        const query = (args.query as string).toLowerCase();
        const results = MOCK_GITHUB_REPOS.filter(
          (repo) => repo.name.toLowerCase().includes(query) || repo.description.toLowerCase().includes(query)
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      }
      case "query_postgres": {
        const query = (args.query as string).toLowerCase();
        if (query.includes("select") && query.includes("users")) {
           // Simple mock response for any select * from users
           return {
             content: [{ type: "text", text: JSON.stringify(MOCK_DB_USERS, null, 2) }]
           }
        }
        return {
            content: [{ type: "text", text: "Query executed successfully. (Mock: Only 'SELECT * FROM users' returns data)" }]
        }
      }
      default:
        throw new Error(`Tool not found: ${name}`);
    }
  }
}
