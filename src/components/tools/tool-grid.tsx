"use client";

import { useMCP } from "@/lib/mcp/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Database, FileText, Github, Loader2 } from "lucide-react";

export function ToolGrid() {
  const { tools, isConnected } = useMCP();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Connecting to MCP Server...</p>
      </div>
    );
  }

  const getIcon = (name: string) => {
    if (name.includes("github")) return Github;
    if (name.includes("file") || name.includes("directory")) return FileText;
    if (name.includes("postgres") || name.includes("sql")) return Database;
    return Wrench;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => {
        const Icon = getIcon(tool.name);
        return (
          <Card key={tool.name} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="p-2 bg-muted rounded-full">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{tool.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 min-h-[40px]">
                {tool.description}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {Object.keys(tool.inputSchema.properties || {}).map((prop) => (
                  <Badge key={prop} variant="secondary" className="font-mono text-xs">
                    {prop}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
