"use client";

import { ArrowUpRight, FileText, MessageSquare, Users, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIVITY_TYPES = {
  DOCUMENT_UPDATED: "document_updated",
  USER_JOINED: "user_joined",
  COMMENT_ADDED: "comment_added",
  DOCUMENT_CREATED: "document_created"
};

const ACTIVITY_ICONS = {
  [ACTIVITY_TYPES.DOCUMENT_UPDATED]: Pencil,
  [ACTIVITY_TYPES.USER_JOINED]: Users,
  [ACTIVITY_TYPES.COMMENT_ADDED]: MessageSquare,
  [ACTIVITY_TYPES.DOCUMENT_CREATED]: FileText
};

const MOCK_ACTIVITIES = [
  { 
    id: 1, 
    type: ACTIVITY_TYPES.DOCUMENT_UPDATED, 
    user: "Jane Cooper", 
    message: "updated the Project Plan document", 
    time: "2 minutes ago" 
  },
  { 
    id: 2, 
    type: ACTIVITY_TYPES.USER_JOINED, 
    user: "Robert Fox", 
    message: "joined the workspace", 
    time: "15 minutes ago" 
  },
  { 
    id: 3, 
    type: ACTIVITY_TYPES.COMMENT_ADDED, 
    user: "Wade Warren", 
    message: "commented on Marketing Strategy", 
    time: "1 hour ago" 
  },
  { 
    id: 4, 
    type: ACTIVITY_TYPES.DOCUMENT_CREATED, 
    user: "Leslie Alexander", 
    message: "created a new document", 
    time: "3 hours ago" 
  },
  { 
    id: 5, 
    type: ACTIVITY_TYPES.DOCUMENT_UPDATED, 
    user: "Dianne Russell", 
    message: "updated Task List", 
    time: "5 hours ago" 
  }
];

export function ActivityItem({ activity, className }) {
  const Icon = ACTIVITY_ICONS[activity.type] || FileText;
  
  return (
    <div className={cn("flex items-center py-3", className)}>
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">
          <span className="font-semibold">{activity.user}</span> {activity.message}
        </p>
        <p className="text-xs text-muted-foreground">
          {activity.time}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
    </div>
  );
}

export function ActivityFeed({ activities = MOCK_ACTIVITIES, className }) {
  return (
    <div className={cn("space-y-1", className)}>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
      
      {activities.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No recent activity
        </div>
      )}
    </div>
  );
} 