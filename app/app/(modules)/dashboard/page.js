"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, FileText, DollarSign, Activity, DownloadCloud, RefreshCw, BarChart3, PieChart, LineChart } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartContainer } from "@/components/dashboard/chart-container";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export default function AppDashboardPage() {
  const stats = [
    { title: "Total Users", value: 1254, previousValue: 1120, icon: Users },
    { title: "Active Documents", value: 845, previousValue: 812, icon: FileText },
    { title: "Revenue", value: "$45678", previousValue: 38712, icon: DollarSign },
    { title: "Active Now", value: 573, previousValue: 489, icon: Activity }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your application stats and activities.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex gap-1">
            <DownloadCloud className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard 
                key={stat.title}
                title={stat.title}
                value={stat.value}
                previousValue={stat.previousValue}
                icon={stat.icon}
              />
            ))}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <ChartContainer 
              title="Overview" 
              description="User activity for the past 30 days"
              className="col-span-4"
              contentClassName="px-2"
              action={
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  View All
                </Button>
              }
            >
              <div className="h-[240px] flex items-center justify-center bg-muted/20 rounded-md">
                <LineChart className="h-8 w-8 text-muted" />
                <span className="ml-2 text-sm text-muted-foreground">Chart: User activity over time</span>
              </div>
            </ChartContainer>
            
            <ChartContainer 
              title="Recent Activity" 
              description="Latest actions in your workspace"
              className="col-span-3"
              action={
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  View All
                </Button>
              }
            >
              <ActivityFeed />
            </ChartContainer>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <ChartContainer 
              title="Document Types" 
              description="Distribution of document categories"
              contentClassName="px-2"
              icon={PieChart}
            >
              <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                <PieChart className="h-8 w-8 text-muted" />
                <span className="ml-2 text-sm text-muted-foreground">Chart: Document type distribution</span>
              </div>
            </ChartContainer>
            
            <ChartContainer 
              title="User Demographics" 
              description="User statistics by region"
              contentClassName="px-2"
              icon={BarChart3}
            >
              <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                <BarChart3 className="h-8 w-8 text-muted" />
                <span className="ml-2 text-sm text-muted-foreground">Chart: User demographics</span>
              </div>
            </ChartContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <ChartContainer title="Analytics Content" description="Detailed analytics information would be displayed here">
            <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
              <span className="text-muted-foreground">Analytics data visualization</span>
            </div>
          </ChartContainer>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <ChartContainer title="Reports Content" description="Reports and exportable data would be displayed here">
            <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
              <span className="text-muted-foreground">Reports and data tables</span>
            </div>
          </ChartContainer>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <ChartContainer title="Notifications Content" description="System and user notifications would be displayed here">
            <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
              <span className="text-muted-foreground">Notification feed and settings</span>
            </div>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
} 