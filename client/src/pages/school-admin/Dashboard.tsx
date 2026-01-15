import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, GraduationCap, Calendar, LogOut } from 'lucide-react';

export default function SchoolAdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 neu-flat m-4 mr-0 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <div className="w-10 h-10 rounded-full neu-pressed flex items-center justify-center p-2">
            <img src="/images/logo-icon.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-primary">SchoolOS</h1>
            <p className="text-xs text-muted-foreground">School Admin</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Overview" active />
          <NavItem icon={<Users />} label="Students" />
          <NavItem icon={<GraduationCap />} label="Teachers" />
          <NavItem icon={<Calendar />} label="Schedule" />
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">School Admin</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full neu-btn py-2 flex items-center justify-center gap-2 text-destructive hover:bg-destructive hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">School Overview</h1>
            <p className="text-muted-foreground">Managing: Cairo International School</p>
          </div>
          <div className="flex gap-4">
            <button className="neu-btn px-4 py-2">
              View Reports
            </button>
            <button className="neu-btn px-4 py-2 bg-primary text-white hover:bg-primary/90">
              Enroll Student
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Students" value="850" change="+12 this week" />
          <StatCard title="Teachers" value="42" change="Full capacity" />
          <StatCard title="Attendance" value="94%" change="-2% from yesterday" />
          <StatCard title="Upcoming Events" value="3" change="Next: Science Fair" />
        </div>

        {/* Recent Activity */}
        <div className="neu-flat p-6">
          <h3 className="text-xl font-bold mb-4">Recent Updates</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Student Enrollment</p>
                    <p className="text-sm text-muted-foreground">Ahmed Ali enrolled in Grade 5</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">1 hour ago</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'neu-pressed text-primary font-bold' 
        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, change }: { title: string, value: string, change: string }) {
  return (
    <div className="neu-flat p-6">
      <h3 className="text-muted-foreground text-sm font-medium mb-2">{title}</h3>
      <div className="text-3xl font-bold text-primary mb-2">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </div>
  );
}
