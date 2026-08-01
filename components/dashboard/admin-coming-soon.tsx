import { Construction } from "lucide-react";

export function AdminComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl tracking-wide">
        {title.toUpperCase()}
      </h1>
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-16 text-center">
        <Construction className="h-8 w-8 text-muted-foreground" />
        <p className="font-display text-lg tracking-wide">Coming Soon</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
