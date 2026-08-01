import {
  BarChart3,
  FileText,
  Flame,
  FolderTree,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Quote,
  Settings,
  Users,
  Video,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Quotes", href: "/admin/quotes", icon: Quote },
  { label: "Videos", href: "/admin/videos", icon: Video },
  { label: "Blog Posts", href: "/admin/blogs", icon: FileText },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Comments", href: "/admin/comments", icon: MessageSquare },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Profile", href: "/admin/profile", icon: Flame },
];

export const ADMIN_BRAND_ICON = Flame;
