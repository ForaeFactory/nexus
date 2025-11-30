"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { NexusMCPClient } from "./client";
import { MockMCPServer } from "./mock-server";
import { Tool } from "./types";

interface MCPContextType {
  client: NexusMCPClient | null;
  tools: Tool[];
  isConnected: boolean;
  refreshTools: () => Promise<void>;
}

const MCPContext = createContext<MCPContextType | undefined>(undefined);

export function MCPProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<NexusMCPClient | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initClient = async () => {
      const server = new MockMCPServer();
      const mcpClient = new NexusMCPClient(server);
      
      try {
        await mcpClient.connect();
        setClient(mcpClient);
        setIsConnected(true);
        
        const availableTools = await mcpClient.listTools();
        setTools(availableTools);
      } catch (error) {
        console.error("Failed to initialize MCP client:", error);
      }
    };

    initClient();

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  const refreshTools = async () => {
    if (client && isConnected) {
      const availableTools = await client.listTools();
      setTools(availableTools);
    }
  };

  return (
    <MCPContext.Provider value={{ client, tools, isConnected, refreshTools }}>
      {children}
    </MCPContext.Provider>
  );
}

export function useMCP() {
  const context = useContext(MCPContext);
  if (context === undefined) {
    throw new Error("useMCP must be used within a MCPProvider");
  }
  return context;
}
