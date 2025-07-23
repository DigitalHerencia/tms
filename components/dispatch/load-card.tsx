import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import type { Load } from "@/types/dispatch";

interface LoadCardProps {
  load: Load;
  onClick: () => void;
}

export function LoadCard({ load, onClick }: LoadCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer rounded-md shadow-md bg-black border border-gray-200 p-6 hover:bg-gray-900 transition-colors"
    >
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-semibold text-white"># {load.referenceNumber || load.id}</span>
          <Badge className="bg-blue-500 text-white">{load.status}</Badge>
        </div>
        <div className="mb-2 text-gray-300 text-xs">
          <User className="inline mr-1 h-4 w-4" /> {load.driver?.name || "Unassigned"}
        </div>
        <div className="text-sm text-gray-400">
          {String(load.origin)} {String(load.destination)}
        </div>
        <div className="text-xs text-gray-500">
          {String(load.pickupDate)} – {String(load.deliveryDate)}
        </div>
      </CardContent>
    </Card>
  );
}
