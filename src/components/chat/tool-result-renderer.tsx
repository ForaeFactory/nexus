"use client";

import { CallToolResult } from "@/lib/mcp/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Folder, Star, GitFork } from "lucide-react";

interface ToolResultRendererProps {
  toolName: string;
  result: CallToolResult;
}

export function ToolResultRenderer({ toolName, result }: ToolResultRendererProps) {
  const content = result.content[0];

  if (content.type !== "text") {
    return <div>Unsupported content type</div>;
  }

  const data = parseResultData(content.text);

  if (toolName === "search_github") {
    return <GitHubResultRenderer data={data} />;
  }

  if (toolName === "list_directory") {
    return <FileListRenderer data={data} />;
  }
  
  if (toolName === "query_postgres") {
      return <DatabaseResultRenderer data={data} />;
  }

  // Fallback for unknown tools or unparseable data
  return (
    <div className="bg-muted/50 p-2 rounded-md font-mono text-xs overflow-x-auto max-h-60">
      <pre>{content.text}</pre>
    </div>
  );
}

function parseResultData(text: string): any {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

function GitHubResultRenderer({ data }: { data: any }) {
  if (!Array.isArray(data)) return <pre>{JSON.stringify(data, null, 2)}</pre>;

  return (
    <div className="grid grid-cols-1 gap-2">
      {data.map((repo: any, i: number) => (
        <Card key={i} className="bg-card/50">
          <CardHeader className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-sm font-medium hover:underline cursor-pointer">
                  <a href={`https://github.com/${repo.name}`} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </CardTitle>
                <CardDescription className="text-xs mt-1 line-clamp-2">
                  {repo.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 flex gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {repo.stars?.toLocaleString() ?? 0}
            </div>
             {/* Mock data might not have forks, but good to have structure */}
            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {repo.forks?.toLocaleString() ?? 0}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FileListRenderer({ data }: { data: any }) {
  if (!Array.isArray(data)) return <pre>{JSON.stringify(data, null, 2)}</pre>;

  return (
    <ScrollArea className="h-48 rounded-md border bg-muted/20 p-2">
      <div className="space-y-1">
        {data.map((file: string, i: number) => (
          <div key={i} className="flex items-center gap-2 text-sm p-1 hover:bg-muted rounded">
            {file.endsWith("/") ? (
              <Folder className="h-4 w-4 text-blue-400" />
            ) : (
              <FileText className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-mono text-xs">{file}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function DatabaseResultRenderer({ data }: { data: any }) {
    if (!Array.isArray(data) || data.length === 0) {
        return <div className="text-sm text-muted-foreground italic">No results or invalid data format.</div>;
    }

    const headers = Object.keys(data[0]);

    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header) => (
                            <TableHead key={header} className="h-8 text-xs">{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row: any, i: number) => (
                        <TableRow key={i}>
                            {headers.map((header) => (
                                <TableCell key={header} className="py-2 text-xs font-mono">
                                    {String(row[header])}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
