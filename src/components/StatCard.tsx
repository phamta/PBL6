import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-primary",
}: StatCardProps) {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground mb-2">{title}</p>
          <h3 className="mb-1">{value}</h3>
          {change && (
            <p className={`text-sm ${changeColors[changeType]}`}>{change}</p>
          )}
        </div>
        <div className={`${iconColor} rounded-lg p-3 text-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}