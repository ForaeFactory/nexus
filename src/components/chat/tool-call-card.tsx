"use client";

import { useState } from "react";
import { ToolCallRequest } from "@/lib/mcp/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolResultRenderer } from "./tool-result-renderer";

interface ToolCallCardProps {
  toolCall: ToolCallRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ToolCallCard({ toolCall, onApprove, onReject }: ToolCallCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="w-full max-w-md my-2 border-l-4 border-l-primary/50">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {toolCall.toolName}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {toolCall.status === "pending" && "Waiting for approval..."}
            {toolCall.status === "executing" && "Executing..."}
            {toolCall.status === "completed" && "Completed"}
            {toolCall.status === "rejected" && "Rejected"}
            {toolCall.status === "failed" && "Failed"}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="py-2 px-4">
          <div className="bg-muted/50 p-2 rounded-md font-mono text-xs overflow-x-auto">
            <pre>{JSON.stringify(toolCall.args, null, 2)}</pre>
          </div>
          
          {toolCall.result && (
            <div className="mt-4">
              <p className="text-xs font-semibold mb-2">Result:</p>
              <ToolResultRenderer toolName={toolCall.toolName} result={toolCall.result} />
            </div>
          )}
          
          {toolCall.error && (
            <div className="mt-4 text-destructive text-xs">
              Error: {toolCall.error}
            </div>
          )}
        </CardContent>
      )}

      {toolCall.status === "pending" && (
        <CardFooter className="py-2 px-4 flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => onReject(toolCall.id)} className="h-8">
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
          <Button size="sm" onClick={() => onApprove(toolCall.id)} className="h-8">
            <Check className="h-4 w-4 mr-1" /> Approve
          </Button>
        </CardFooter>
      )}
      
      {toolCall.status === "executing" && (
        <CardFooter className="py-2 px-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 mr-2 animate-spin" /> Running tool...
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
