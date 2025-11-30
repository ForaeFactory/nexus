import { ToolCallRequest } from "@/lib/mcp/types";

export interface LLMResponse {
  content: string;
  toolCalls?: ToolCallRequest[];
}

export async function mockLLMProcess(input: string): Promise<LLMResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate thinking

  const lowerInput = input.toLowerCase();
  const toolCalls: ToolCallRequest[] = [];

  if (lowerInput.includes("list") || lowerInput.includes("files")) {
    toolCalls.push({
      id: crypto.randomUUID(),
      toolName: "list_directory",
      args: { path: "/" },
      status: "pending",
      timestamp: Date.now(),
    });
    return {
      content: "I'll list the files in the root directory for you.",
      toolCalls,
    };
  }

  if (lowerInput.includes("read") && lowerInput.includes("readme")) {
    toolCalls.push({
      id: crypto.randomUUID(),
      toolName: "read_file",
      args: { path: "/README.md" },
      status: "pending",
      timestamp: Date.now(),
    });
    return {
      content: "I'll read the README.md file.",
      toolCalls,
    };
  }

  if (lowerInput.includes("search") && lowerInput.includes("github")) {
    toolCalls.push({
      id: crypto.randomUUID(),
      toolName: "search_github",
      args: { query: "react" }, // Simple mock
      status: "pending",
      timestamp: Date.now(),
    });
    return {
      content: "Searching GitHub for 'react'...",
      toolCalls,
    };
  }

  if (lowerInput.includes("users") || lowerInput.includes("query")) {
    toolCalls.push({
      id: crypto.randomUUID(),
      toolName: "query_postgres",
      args: { query: "SELECT * FROM users" },
      status: "pending",
      timestamp: Date.now(),
    });
    return {
      content: "I'll query the users database.",
      toolCalls,
    };
  }

  return {
    content: "I understand. You said: " + input,
  };
}
