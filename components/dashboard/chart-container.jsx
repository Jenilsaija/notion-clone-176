"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ChartContainer({ 
  title, 
  description, 
  className, 
  contentClassName,
  children,
  icon: Icon,
  action
}) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}
        {Icon && !action && <Icon className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent className={cn("px-6", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
} 