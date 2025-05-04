"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ title, value, previousValue, icon: Icon, className }) {
  const [counter, setCounter] = useState(0);
  const [trend, setTrend] = useState({ percentage: 0, isPositive: true });
  
  useEffect(() => {
    // Calculate trend percentage if both values are provided
    if (previousValue && value) {
      const diff = value - previousValue;
      const percentage = ((diff / previousValue) * 100).toFixed(1);
      setTrend({
        percentage: Math.abs(percentage),
        isPositive: diff >= 0
      });
    }
    
    // Animate counter
    const target = parseFloat(value) || 0;
    const duration = 1000;
    const step = Math.max(1, target / (duration / 16));
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCounter(target);
        clearInterval(timer);
      } else {
        setCounter(Math.floor(current));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, previousValue]);
  
  // Format the counter value
  const formattedValue = typeof value === 'string' && value.startsWith('$') 
    ? `$${counter.toLocaleString()}`
    : counter.toLocaleString();
  
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {trend.percentage > 0 && (
          <p className={cn(
            "text-xs flex items-center gap-1",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <span className={cn(
              "inline-block",
              trend.isPositive ? "rotate-0" : "rotate-180"
            )}>
              ↑
            </span>
            {trend.percentage}% {trend.isPositive ? "increase" : "decrease"}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 