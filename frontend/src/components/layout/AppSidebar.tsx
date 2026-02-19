import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Route as RouteIcon,
  GraduationCap,
  Truck,
  Users,
  Info,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Routes',
    href: '/admin/routes',
    icon: RouteIcon,
  },
  {
    title: 'Drivers',
    href: '/admin/drivers',
    icon: Truck,
  },
  {
    title: 'Students',
    href: '/admin/students',
    icon: GraduationCap,
  },
];

const parentNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/parent/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Children',
    href: '/parent/children',
    icon: Users,
  },
  {
    title: 'Transport Info',
    href: '/parent/transport',
    icon: Info,
  },
];

const getNavItems = (role: string | undefined): NavItem[] => {
  switch (role) {
    case 'ADMIN':
      return adminNavItems;
    case 'PARENT':
      return parentNavItems;
    default:
      return adminNavItems;
  }
};

const getPortalName = (role: string | undefined): string => {
  switch (role) {
    case 'ADMIN':
      return 'Admin Portal';
    case 'PARENT':
      return 'Parent Portal';
    default:
      return 'Portal';
  }
};

export const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = getNavItems(user?.role);
  const portalName = getPortalName(user?.role);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Truck className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Transport Ops</span>
            <span className="text-xs text-muted-foreground">
              {portalName}
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
