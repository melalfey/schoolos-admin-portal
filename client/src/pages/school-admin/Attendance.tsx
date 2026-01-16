import { useState, useEffect } from 'react';
import SchoolAdminLayout from '@/components/SchoolAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2, ClipboardCheck, Calendar } from 'lucide-react';
import { attendanceService } from '@/services/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function Attendance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getAll(1, 100, search);
      setRecords(response.data || []);
    } catch (error) {
      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttendance();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <SchoolAdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">Monitor student attendance records.</p>
        </div>
        <Button className="neu-btn bg-primary text-white">
          <ClipboardCheck className="mr-2 h-4 w-4" /> Mark Attendance
        </Button>
      </div>

      <Card className="neu-flat border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Records</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search records..." 
                className="pl-9 bg-white/50" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No attendance records found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {record.type}
                        </span>
                    </TableCell>
                    <TableCell>{record.studentId}</TableCell>
                    <TableCell>
                        {record.type === 'LESSON' && <span className="text-xs text-muted-foreground">Period: {record.period}</span>}
                        {record.type === 'ECA' && <span className="text-xs text-muted-foreground">Activity: {record.activityId}</span>}
                        {record.isEmergencyCheck && <span className="text-xs text-red-600 font-bold ml-2">⚠️ EMERGENCY</span>}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                        record.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                        record.status === 'LATE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {record.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </SchoolAdminLayout>
  );
}
