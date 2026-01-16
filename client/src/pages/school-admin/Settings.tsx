import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { schoolService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    attendanceCutoff: '08:30',
    academicYear: '2023-2024'
  });

  useEffect(() => {
    if (user?.tenants?.[0]?.tenantId) {
      fetchSchoolDetails(user.tenants[0].tenantId);
    }
  }, [user]);

  const fetchSchoolDetails = async (id: string) => {
    try {
      const res = await schoolService.getOne(id);
      setSchool(res);
      setFormData({
        name: res.name,
        domain: res.domain || '',
        attendanceCutoff: res.settings?.attendanceCutoff || '08:30',
        academicYear: res.settings?.academicYear || '2023-2024'
      });
    } catch (error) {
      toast.error("Failed to load school settings");
    }
  };

  const handleSave = async () => {
    if (!school) return;
    setLoading(true);
    try {
      await schoolService.update(school.id, {
        name: formData.name,
        domain: formData.domain,
        settings: {
          ...school.settings,
          attendanceCutoff: formData.attendanceCutoff,
          academicYear: formData.academicYear
        }
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">School Settings</h1>
        <p className="text-muted-foreground">Manage general configuration and academic rules</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Basic details about your institution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>School Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Custom Domain</Label>
              <Input 
                value={formData.domain} 
                onChange={(e) => setFormData({...formData, domain: e.target.value})} 
                placeholder="e.g. school.edu.eg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Configuration</CardTitle>
            <CardDescription>Rules for attendance and grading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Attendance Cut-off Time</Label>
              <Input 
                type="time"
                value={formData.attendanceCutoff} 
                onChange={(e) => setFormData({...formData, attendanceCutoff: e.target.value})} 
              />
              <p className="text-xs text-muted-foreground">
                Students arriving after this time will be marked as "Late".
              </p>
            </div>
            <div className="space-y-2">
              <Label>Current Academic Year</Label>
              <Input 
                value={formData.academicYear} 
                onChange={(e) => setFormData({...formData, academicYear: e.target.value})} 
                placeholder="e.g. 2023-2024"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
