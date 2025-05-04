"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, DownloadCloud, RefreshCw, PieChart, Clock, Lock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartContainer } from "@/components/dashboard/chart-container";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { makeRequest } from "@/lib/axios.lib";

export default function AppDashboardPage() {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notesCategories, setNotesCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiErrors, setApiErrors] = useState({});

  const iconMap = {
    "FileText": FileText,
    "Clock": Clock,
    "Lock": Lock
  };

  async function fetchDashboardData() {
    setLoading(true);
    setError(null);
    setApiErrors({});
    
    try {
      // Fetch dashboard statistics
      const statsResponse = await makeRequest("/api/dashboard", {
        action: "DASHBOARD.STATS"
      });
      
      if (statsResponse && statsResponse.data.status) {
        // Map the icon strings to actual components
        const mappedStats = statsResponse.data.data.stats.map(stat => ({
          ...stat,
          icon: iconMap[stat.icon]
        }));
        setStats(mappedStats);
      } else {
        const errorMessage = statsResponse?.data?.message || "Failed to fetch statistics";
        console.error("Failed to fetch stats:", errorMessage);
        setApiErrors(prev => ({ ...prev, stats: errorMessage }));
      }
      
      // Fetch activity feed
      const activityResponse = await makeRequest("/api/dashboard", {
        action: "DASHBOARD.ACTIVITY"
      });
      
      if (activityResponse && activityResponse.data.status) {
        setActivities(activityResponse.data.data);
      } else {
        const errorMessage = activityResponse?.data?.message || "Failed to fetch activity";
        console.error("Failed to fetch activities:", errorMessage);
        setApiErrors(prev => ({ ...prev, activities: errorMessage }));
      }
      
      // Fetch notes categories data
      const notesResponse = await makeRequest("/api/dashboard", {
        action: "DASHBOARD.NOTES"
      });
      
      if (notesResponse && notesResponse.data.status) {
        setNotesCategories(notesResponse.data.data);
      } else {
        const errorMessage = notesResponse?.data?.message || "Failed to fetch notes categories";
        console.error("Failed to fetch notes categories:", errorMessage);
        setApiErrors(prev => ({ ...prev, notes: errorMessage }));
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  // Use fallback data if API fails or no data is returned
  const fallbackStats = [
    { title: "Total Notes", value: 0, icon: FileText },
    { title: "Recent Notes", value: 0, icon: Clock },
    { title: "Private Notes", value: 0, icon: Lock }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Notes Dashboard</h1>
          <p className="text-muted-foreground">Overview of your personal notes and recent activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {Object.keys(apiErrors).length > 0 && (
        <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded">
          <p className="font-medium mb-1">Some dashboard data couldn't be loaded:</p>
          <ul className="list-disc pl-5 text-sm">
            {Object.entries(apiErrors).map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
          <p className="text-sm mt-2">Showing fallback data where needed. Try refreshing or check back later.</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Show loading indicators for stat cards
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[120px] bg-muted/20 rounded-md animate-pulse"></div>
            ))
          ) : (
            (stats.length > 0 ? stats : fallbackStats).map((stat) => (
              <StatCard 
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            ))
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <ChartContainer 
            title="Notes by Category" 
            description="Distribution of notes by category"
            contentClassName="px-2"
            icon={PieChart}
          >
            <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
              <PieChart className="h-8 w-8 text-muted" />
              <span className="ml-2 text-sm text-muted-foreground">
                {loading ? "Loading category data..." : (
                  apiErrors.notes ? "Could not load category data" : 
                  (notesCategories.length === 0 ? "No category data available" : "Chart: Notes by category")
                )}
              </span>
            </div>
          </ChartContainer>
          
          <ChartContainer 
            title="Recent Activity" 
            description="Latest note activities"
            action={
              <Button variant="ghost" size="sm" className="h-8 px-2">
                View All
              </Button>
            }
          >
            {loading ? (
              <div className="flex flex-col gap-4 py-2">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-[60px] bg-muted/20 rounded-md animate-pulse"></div>
                ))}
              </div>
            ) : (
              <ActivityFeed activities={activities} />
            )}
          </ChartContainer>
        </div>
      </div>
    </div>
  );
} 