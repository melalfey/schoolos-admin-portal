import SchoolAdminLayout from '@/components/SchoolAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Students() {
  return (
    <SchoolAdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage student enrollment and records.</p>
        </div>
        <Button className="neu-btn bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      <Card className="neu-flat border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-9 bg-white/50" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>No students found. Add your first student to get started.</p>
          </div>
        </CardContent>
      </Card>
    </SchoolAdminLayout>
  );
}
