import { Shell } from "@/components/layout/shell";

export default function SettingsPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your workspace preferences.
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-muted/50">
          <p>Settings are coming soon.</p>
        </div>
      </div>
    </Shell>
  );
}
