import { MCPClient, MCPServer, Tool, CallToolResult } from "./types";

export class NexusMCPClient implements MCPClient {
  private server: MCPServer;
  private isConnected: boolean = false;

  constructor(server: MCPServer) {
    this.server = server;
  }

  async connect(): Promise<void> {
    // Simulate connection handshake
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.isConnected = true;
    console.log("MCP Client connected.");
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log("MCP Client disconnected.");
  }

  async listTools(): Promise<Tool[]> {
    if (!this.isConnected) {
      throw new Error("Client not connected");
    }
    return this.server.listTools();
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<CallToolResult> {
    if (!this.isConnected) {
      throw new Error("Client not connected");
    }
    return this.server.callTool(name, args);
  }
}
