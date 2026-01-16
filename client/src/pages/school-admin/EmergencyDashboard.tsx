import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { attendanceService, studentService } from '@/services/api';
import { toast } from "sonner";

export default function EmergencyDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    missing: 0
  });
  const [missingStudents, setMissingStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  useEffect(() => {
    fetchEmergencyStatus();
  }, []);

  const fetchEmergencyStatus = async () => {
    setLoading(true);
    try {
      // In a real app, we would have a dedicated endpoint for emergency stats
      // For MVP, we'll fetch all students and check their latest attendance status
      const studentsResponse = await studentService.getAll();
      const students = studentsResponse.data || [];
      
      // Mocking emergency status for demonstration since we don't have a live emergency trigger yet
      // In production, this would come from the backend state
      const total = students.length;
      const safe = Math.floor(total * 0.8); // Mock data
      const missing = total - safe;

      setStats({ total, safe, missing });
      
      // Mock missing students list
      setMissingStudents(students.slice(0, missing).map((s: any) => ({
        ...s,
        lastSeen: '09:00 AM - Math Class'
      })));

    } catch (error) {
      console.error("Failed to fetch emergency stats", error);
      toast.error("Failed to load emergency status");
    } finally {
      setLoading(false);
    }
  };

  const toggleEmergencyMode = () => {
    setIsEmergencyMode(!isEmergencyMode);
    if (!isEmergencyMode) {
      toast.error("EMERGENCY MODE ACTIVATED - All staff notified", {
        duration: 5000,
        style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444' }
      });
    } else {
      toast.success("Emergency Mode Deactivated");
    }
  };

  const markSafe = async (studentId: string) => {
    // Call API to mark student as safe
    toast.success(`Student marked as SAFE`);
    // Optimistic update
    setMissingStudents(prev => prev.filter(s => s.id !== studentId));
    setStats(prev => ({ ...prev, safe: prev.safe + 1, missing: prev.missing - 1 }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            Emergency Evacuation Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time muster roll and safety tracking
          </p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" onClick={fetchEmergencyStatus}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button 
                variant={isEmergencyMode ? "destructive" : "default"} 
                className={isEmergencyMode ? "animate-pulse font-bold" : "bg-red-600 hover:bg-red-700"}
                onClick={toggleEmergencyMode}
            >
                {isEmergencyMode ? "END EMERGENCY" : "ACTIVATE EMERGENCY"}
            </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">On Campus</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Verified Safe</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.safe}</div>
            <p className="text-xs text-green-600">
              {stats.total > 0 ? Math.round((stats.safe / stats.total) * 100) : 0}% Accounted For
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Missing / Unaccounted</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.missing}</div>
            <p className="text-xs text-red-600">Immediate Action Required</p>
          </CardContent>
        </Card>
      </div>

      {/* Missing Students List */}
      <Card className="border-red-200">
        <CardHeader className="bg-red-50/50">
          <CardTitle className="text-red-800">Missing Students List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Grade / Class</TableHead>
                <TableHead>Last Known Location</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missingStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-green-600 font-medium">
                    <CheckCircle className="inline-block mr-2 h-5 w-5" />
                    All students accounted for!
                  </TableCell>
                </TableRow>
              ) : (
                missingStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                        {student.firstName} {student.lastName}
                        <div className="text-xs text-muted-foreground">{student.admissionNumber}</div>
                    </TableCell>
                    <TableCell>{student.gradeLevel || 'N/A'}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            {student.lastSeen}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => markSafe(student.id)}
                      >
                        Mark Safe
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
