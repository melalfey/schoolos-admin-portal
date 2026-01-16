import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/super-admin/Dashboard";
import SchoolDetails from "./pages/super-admin/SchoolDetails";
import SchoolAdminDashboard from "./pages/school-admin/Dashboard";
import Students from "./pages/school-admin/Students";
import Staff from "./pages/school-admin/Staff";
import Classes from "./pages/school-admin/Classes";
import Attendance from "./pages/school-admin/Attendance";
import EmergencyDashboard from "./pages/school-admin/EmergencyDashboard";
import Timetable from "./pages/school-admin/Timetable";
import Reports from "./pages/school-admin/Reports";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      
      {/* Redirect root to login */}
      <Route path="/">
        <Redirect to="/login" />
      </Route>

      {/* Super Admin Routes */}
      <Route path="/super-admin/dashboard">
        <PrivateRoute requireSuperAdmin>
          <SuperAdminDashboard />
        </PrivateRoute>
      </Route>

      <Route path="/super-admin/schools/:id">
        <PrivateRoute requireSuperAdmin>
          <SchoolDetails />
        </PrivateRoute>
      </Route>

      {/* School Admin Routes */}
      <Route path="/school-admin/dashboard">
        <PrivateRoute requiredRoles={['school_admin']}>
          <SchoolAdminDashboard />
        </PrivateRoute>
      </Route>

      <Route path="/school-admin/students">
        <PrivateRoute requiredRoles={['school_admin']}>
          <Students />
        </PrivateRoute>
      </Route>

      <Route path="/school-admin/staff">
        <PrivateRoute requiredRoles={['school_admin']}>
          <Staff />
        </PrivateRoute>
      </Route>

      <Route path="/school-admin/classes">
        <PrivateRoute requiredRoles={['school_admin']}>
          <Classes />
        </PrivateRoute>
      </Route>

      <Route path="/school-admin/attendance">
        <PrivateRoute requiredRoles={['school_admin']}>
          <Attendance />
        </PrivateRoute>
      </Route>

      <Route path="/school-admin/emergency">
        <PrivateRoute requiredRoles={['school_admin']}>
          <EmergencyDashboard />
        </PrivateRoute>
      </Route>

      <Route path="/school-admin/timetable">
        <PrivateRoute requiredRoles={['school_admin']}>
          <Timetable />
        </PrivateRoute>
      </Route>

      <Route path="/school-admin/reports">
        <PrivateRoute requiredRoles={['school_admin']}>
          <Reports />
        </PrivateRoute>
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
