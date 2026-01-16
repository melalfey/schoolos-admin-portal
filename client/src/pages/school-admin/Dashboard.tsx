import SchoolAdminLayout from '@/components/SchoolAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen, ClipboardCheck } from 'lucide-react';

export default function SchoolAdminDashboard() {
  return (
    <SchoolAdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your school management portal.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Users className="h-6 w-6 text-blue-500" />}
          title="Total Students"
          value="0"
          subtitle="Enrolled students"
        />
        <StatCard 
          icon={<GraduationCap className="h-6 w-6 text-green-500" />}
          title="Total Staff"
          value="0"
          subtitle="Teachers & Staff"
        />
        <StatCard 
          icon={<BookOpen className="h-6 w-6 text-purple-500" />}
          title="Active Classes"
          value="0"
          subtitle="Current academic year"
        />
        <StatCard 
          icon={<ClipboardCheck className="h-6 w-6 text-orange-500" />}
          title="Attendance"
          value="0%"
          subtitle="Today's average"
        />
      </div>

      {/* Recent Activity Placeholder */}
      <Card className="neu-flat border-none">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity to display.</p>
          </div>
        </CardContent>
      </Card>
    </SchoolAdminLayout>
  );
}

function StatCard({ icon, title, value, subtitle }: { icon: any, title: string, value: string, subtitle: string }) {
  return (
    <Card className="neu-flat border-none">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full neu-pressed flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-primary">{value}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}
