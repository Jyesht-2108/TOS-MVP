import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export const ParentLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSidebarToggle={false} />
      <main className="flex-1 overflow-auto p-4 md:p-6 smooth-scroll">
        <Outlet />
      </main>
    </div>
  );
};
