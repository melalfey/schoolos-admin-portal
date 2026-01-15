import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus, Loader2 } from 'lucide-react';
import { schoolService } from '@/services/api';

interface AssignAdminModalProps {
  schoolId: string;
  onAdminAssigned: () => void;
}

export function AssignAdminModal({ schoolId, onAdminAssigned }: AssignAdminModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await schoolService.addAdmin(schoolId, email);
      toast.success("Admin assigned successfully");
      setOpen(false);
      setEmail('');
      onAdminAssigned();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to assign admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white shadow-neumorphic-sm">
          <UserPlus className="mr-2 h-4 w-4" /> Assign Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-white/20 shadow-neumorphic">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Assign School Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/50 border-white/20 focus:border-primary/50 transition-all"
            />
            <p className="text-xs text-muted-foreground">
              The user must already be registered in the system.
            </p>
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Assigning...
                </>
              ) : (
                'Assign Admin'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
