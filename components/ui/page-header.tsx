// FleetFusion Design System: PageHeader component
import React from "react";

export function PageHeader({ title, description, action, className = "" }: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-6 flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {action ? <div>{action}</div> : null}
      </div>
      {description ? (
        <p className="text-muted-foreground text-base">{description}</p>
      ) : null}
    </div>
  );
}
