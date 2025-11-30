import { Shell } from "@/components/layout/shell";
import { ToolGrid } from "@/components/tools/tool-grid";

export default function ToolsPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
          <p className="text-muted-foreground">
            Discover and manage available MCP tools.
          </p>
        </div>
        <ToolGrid />
      </div>
    </Shell>
  );
}
