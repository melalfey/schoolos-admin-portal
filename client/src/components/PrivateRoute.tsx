import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requireSuperAdmin?: boolean;
}

export default function PrivateRoute({ 
  children, 
  requiredRoles = [], 
  requireSuperAdmin = false 
}: PrivateRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Check Super Admin requirement
  if (requireSuperAdmin && !user?.isSuperAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="neu-flat p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access this area. This area is restricted to Super Administrators.
          </p>
          <button 
            onClick={() => setLocation('/school-admin/dashboard')}
            className="neu-btn px-6 py-2 w-full"
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check Role requirement
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="neu-flat p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Unauthorized</h1>
          <p className="text-muted-foreground mb-6">
            Your role ({user.role}) does not have permission to view this page.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="neu-btn px-6 py-2 w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
