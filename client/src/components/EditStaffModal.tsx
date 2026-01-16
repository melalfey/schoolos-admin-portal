import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { staffService } from '@/services/api';

interface EditStaffModalProps {
  staff: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStaffUpdated: () => void;
}

export function EditStaffModal({ staff, open, onOpenChange, onStaffUpdated }: EditStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    phoneNumber: '',
    departmentId: '',
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        firstName: staff.firstName || '',
        lastName: staff.lastName || '',
        employeeId: staff.employeeId || '',
        email: staff.email || '',
        phoneNumber: staff.phoneNumber || '',
        departmentId: staff.departmentId || '',
      });
    }
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await staffService.update(staff.id, formData);
      toast.success("Staff member updated successfully");
      onOpenChange(false);
      onStaffUpdated();
    } catch (error: any) {
      toast.error(error.message || "Failed to update staff member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-white/20 shadow-neumorphic">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Edit Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-staff-firstName">First Name</Label>
              <Input
                id="edit-staff-firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-staff-lastName">Last Name</Label>
              <Input
                id="edit-staff-lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="bg-white/50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-staff-employeeId">Employee ID</Label>
            <Input
              id="edit-staff-employeeId"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
              className="bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-staff-email">Email</Label>
            <Input
              id="edit-staff-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-staff-phone">Phone Number</Label>
            <Input
              id="edit-staff-phone"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-staff-department">Department</Label>
            <Input
              id="edit-staff-department"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              placeholder="e.g. Science, Math, Admin"
              className="bg-white/50"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white shadow-neumorphic-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
