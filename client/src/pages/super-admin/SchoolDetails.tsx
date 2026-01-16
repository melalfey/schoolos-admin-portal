import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { schoolService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, GraduationCap, Building2, Settings, UserPlus, Trash2, Mail, MoreVertical, XCircle, Save, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation } from 'wouter';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AssignAdminModal } from '@/components/AssignAdminModal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'wouter';
import { toast } from 'sonner';

export default function SchoolDetails() {
  const [, params] = useRoute('/super-admin/schools/:id');
  const id = params?.id;
  const [, setLocation] = useLocation();
  
  const [school, setSchool] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', domain: '', slug: '', isActive: true });
  const [isSaving, setIsSaving] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSchool();
      fetchAdmins();
    }
  }, [id]);

  const fetchSchool = async () => {
    try {
      const data = await schoolService.getOne(id!);
      setSchool(data);
      setEditForm({
        name: data.name,
        domain: data.domain || '',
        slug: data.slug,
        isActive: data.isActive
      });
    } catch (error) {
      toast.error("Failed to load school details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const data = await schoolService.getAdmins(id!);
      setAdmins(data);
    } catch (error) {
      console.error("Failed to load admins", error);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;
    try {
      await schoolService.removeAdmin(id!, userId);
      toast.success("Admin removed successfully");
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to remove admin");
    }
  };

  const handleUpdateSchool = async () => {
    setIsSaving(true);
    try {
      await schoolService.update(id!, editForm);
      toast.success("School updated successfully");
      fetchSchool();
    } catch (error) {
      toast.error("Failed to update school");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSchool = async () => {
    try {
      await schoolService.delete(id!);
      toast.success("School deleted successfully");
      setLocation('/super-admin/dashboard');
    } catch (error) {
      toast.error("Failed to delete school");
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="neu-btn-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete School
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the school
                    <span className="font-bold text-foreground"> {school.name} </span>
                    and all associated data including students, staff, and records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteSchool} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete School
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
              <AssignAdminModal schoolId={id!} onAdminAssigned={fetchAdmins} />
            </CardHeader>
            <CardContent>
              {admins.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No administrators assigned yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20 shadow-sm">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {admin.firstName?.[0] || admin.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">
                            {admin.firstName} {admin.lastName}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="mr-1 h-3 w-3" /> {admin.email}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleRemoveAdmin(admin.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="neu-flat border-none">
            <CardHeader>
              <CardTitle>Edit School Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Slug (URL Identifier)</Label>
                  <Input 
                    value={editForm.slug} 
                    onChange={(e) => setEditForm({...editForm, slug: e.target.value})} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Custom Domain</Label>
                  <Input 
                    value={editForm.domain} 
                    onChange={(e) => setEditForm({...editForm, domain: e.target.value})} 
                    placeholder="e.g. school.edu.eg"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Active Status</Label>
                    <p className="text-sm text-muted-foreground">Disable to block access</p>
                  </div>
                  <Switch 
                    checked={editForm.isActive}
                    onCheckedChange={(checked) => setEditForm({...editForm, isActive: checked})}
                  />
                </div>

                <Button onClick={handleUpdateSchool} disabled={isSaving} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
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
