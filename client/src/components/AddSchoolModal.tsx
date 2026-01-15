import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import { schoolService } from '@/services/api';

interface AddSchoolModalProps {
  onSchoolAdded: () => void;
}

export function AddSchoolModal({ onSchoolAdded }: AddSchoolModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    domain: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from name if slug is empty or was auto-generated
    if (name === 'name' && (!formData.slug || formData.slug === formData.name.toLowerCase().replace(/\s+/g, '-'))) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await schoolService.create(formData);
      toast.success("School created successfully");
      setOpen(false);
      setFormData({ name: '', slug: '', domain: '' });
      onSchoolAdded();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create school");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add School
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-white/20 shadow-neumorphic">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Add New School</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Springfield High"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-white/50 border-white/20 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL Identifier)</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="e.g. springfield-high"
              value={formData.slug}
              onChange={handleChange}
              required
              className="bg-white/50 border-white/20 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Custom Domain (Optional)</Label>
            <Input
              id="domain"
              name="domain"
              placeholder="e.g. springfield.edu"
              value={formData.domain}
              onChange={handleChange}
              className="bg-white/50 border-white/20 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                'Create School'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
