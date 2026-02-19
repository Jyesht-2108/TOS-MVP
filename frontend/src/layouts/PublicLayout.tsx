import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">
                Transport Operations System
              </h1>
              <p className="text-muted-foreground">
                School Transport Management
              </p>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
