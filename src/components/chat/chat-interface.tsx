"use client";

import { useState, useRef, useEffect } from "react";
import { useMCP } from "@/lib/mcp/context";
import { mockLLMProcess } from "@/lib/llm/mock-llm";
import { ChatMessage, ToolCallRequest } from "@/lib/mcp/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { ToolCallCard } from "./tool-call-card";
import { toast } from "sonner";

export function ChatInterface() {
  const { client, isConnected } = useMCP();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    try {
      // 1. Get LLM Response (Intent Detection)
      const response = await mockLLMProcess(userMsg.content);
      
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.content,
        toolCalls: response.toolCalls,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      toast.error("Failed to process message");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToolApprove = async (messageId: string, toolCallId: string) => {
    if (!client || !isConnected) {
      toast.error("MCP Client not connected");
      return;
    }

    // Update status to executing
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        return {
          ...msg,
          toolCalls: msg.toolCalls?.map((tc) =>
            tc.id === toolCallId ? { ...tc, status: "executing" } : tc
          ),
        };
      })
    );

    // Find the tool call to execute
    const message = messages.find((m) => m.id === messageId);
    const toolCall = message?.toolCalls?.find((tc) => tc.id === toolCallId);

    if (!toolCall) return;

    try {
      const result = await client.callTool(toolCall.toolName, toolCall.args);
      
      // Update status to completed with result
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          return {
            ...msg,
            toolCalls: msg.toolCalls?.map((tc) =>
              tc.id === toolCallId ? { ...tc, status: "completed", result } : tc
            ),
          };
        })
      );
      toast.success(`Tool ${toolCall.toolName} executed successfully`);
    } catch (error) {
      // Update status to failed
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          return {
            ...msg,
            toolCalls: msg.toolCalls?.map((tc) =>
              tc.id === toolCallId ? { ...tc, status: "failed", error: String(error) } : tc
            ),
          };
        })
      );
      toast.error(`Tool ${toolCall.toolName} failed`);
    }
  };

  const handleToolReject = (messageId: string, toolCallId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        return {
          ...msg,
          toolCalls: msg.toolCalls?.map((tc) =>
            tc.id === toolCallId ? { ...tc, status: "rejected" } : tc
          ),
        };
      })
    );
    toast.info("Tool execution rejected");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-6 pb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground opacity-50">
              <Sparkles className="h-12 w-12 mb-4" />
              <p>Start a conversation with Nexus...</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {msg.content}
                </div>
                
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-2 space-y-2 w-full">
                    {msg.toolCalls.map((tc) => (
                      <ToolCallCard
                        key={tc.id}
                        toolCall={tc}
                        onApprove={() => handleToolApprove(msg.id, tc.id)}
                        onReject={() => handleToolReject(msg.id, tc.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="pt-4 mt-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Nexus to do something..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button type="submit" disabled={isProcessing || !input.trim()}>
            {isProcessing ? <Sparkles className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
