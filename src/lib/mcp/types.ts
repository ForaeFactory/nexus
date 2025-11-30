import { Tool, CallToolResult, TextContent, ImageContent, EmbeddedResource } from "@modelcontextprotocol/sdk/types.js";

export type { Tool, CallToolResult, TextContent, ImageContent, EmbeddedResource };

export interface MCPClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  listTools(): Promise<Tool[]>;
  callTool(name: string, args: Record<string, unknown>): Promise<CallToolResult>;
}

export interface MCPServer {
  listTools(): Promise<Tool[]>;
  callTool(name: string, args: Record<string, unknown>): Promise<CallToolResult>;
}

export interface ToolCallRequest {
  id: string;
  toolName: string;
  args: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed';
  result?: CallToolResult;
  error?: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: ToolCallRequest[];
  timestamp: number;
}
