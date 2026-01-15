import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { schoolService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, GraduationCap, Building2, Settings, UserPlus, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from 'sonner';

export default function SchoolDetails() {
  const [, params] = useRoute('/super-admin/schools/:id');
  const id = params?.id;
  
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSchool();
    }
  }, [id]);

  const fetchSchool = async () => {
    try {
      const data = await schoolService.getOne(id!);
      setSchool(data);
    } catch (error) {
      toast.error("Failed to load school details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-muted-foreground">School not found</h2>
        <Link href="/super-admin/dashboard">
          <Button className="mt-4" variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/super-admin/dashboard">
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{school.name}</h1>
            <div className="flex gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" /> {school.domain || 'No custom domain'}
              </span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-medium">
                {school.slug}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="neu-btn">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button variant="destructive" className="neu-btn-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete School
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<Users className="h-6 w-6 text-blue-500" />}
          title="Total Students"
          value="0"
          subtitle="Enrolled students"
        />
        <StatCard 
          icon={<GraduationCap className="h-6 w-6 text-green-500" />}
          title="Active Staff"
          value="0"
          subtitle="Teachers & Admins"
        />
        <StatCard 
          icon={<Building2 className="h-6 w-6 text-purple-500" />}
          title="Status"
          value={school.isActive ? "Active" : "Inactive"}
          subtitle="Current subscription"
        />
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="neu-flat p-1 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:neu-pressed">Overview</TabsTrigger>
          <TabsTrigger value="admins" className="data-[state=active]:neu-pressed">Admins</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:neu-pressed">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="neu-flat border-none">
            <CardHeader>
              <CardTitle>School Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">School Name</label>
                    <p className="text-lg">{school.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Slug</label>
                    <p className="text-lg">{school.slug}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Domain</label>
                    <p className="text-lg">{school.domain || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                    <p className="text-lg">{new Date(school.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card className="neu-flat border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>School Administrators</CardTitle>
              <Button className="bg-primary text-white shadow-neumorphic-sm">
                <UserPlus className="mr-2 h-4 w-4" /> Assign Admin
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No administrators assigned yet.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="neu-flat border-none">
            <CardHeader>
              <CardTitle>School Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configuration options coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
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
