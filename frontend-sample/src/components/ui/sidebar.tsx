import * as React from "react";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  
  return (
    <SidebarContext.Provider value={{ collapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return React.useContext(SidebarContext);
}
