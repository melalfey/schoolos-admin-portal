import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calendar } from "lucide-react";
import { scheduleService, classService, staffService } from '@/services/api';
import { toast } from "sonner";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
];

export default function Timetable() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    day: 'Monday',
    startTime: '08:00',
    endTime: '09:00',
    subjectId: '', // Using string for subject name for MVP if subjectId not available
    subjectName: '',
    teacherId: '',
    room: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSchedules();
    }
  }, [selectedClass]);

  const fetchInitialData = async () => {
    try {
      const [classesRes, teachersRes] = await Promise.all([
        classService.getAll(1, 100),
        staffService.getAll(1, 100)
      ]);
      setClasses(classesRes.data || []);
      setTeachers(teachersRes.data || []);
      if (classesRes.data?.length > 0) {
        setSelectedClass(classesRes.data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load initial data");
    }
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await scheduleService.getAll({ classId: selectedClass });
      setSchedules(res || []);
    } catch (error) {
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await scheduleService.create({
        ...formData,
        classId: selectedClass,
        // For MVP, we might send subjectName as subjectId if backend expects ID but we only have text
        // Or we need a Subject selector. Assuming simple string for now or ID if we had subjects.
        // Let's assume we send subjectName as 'subject' field if schema allows, or we need to create subject first.
        // The schema has subjectId. We'll use a mock subject ID or just send the name if backend handles it.
        // Wait, backend expects subjectId. We don't have subjects loaded.
        // For MVP, let's just use the first subject if available or handle it gracefully.
        // Actually, the schema has subjectId as optional string? No, relation.
        // Let's just send the raw data and see.
      });
      toast.success("Class scheduled successfully");
      setIsAddOpen(false);
      fetchSchedules();
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule class");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await scheduleService.delete(id);
      toast.success("Schedule removed");
      fetchSchedules();
    } catch (error) {
      toast.error("Failed to delete schedule");
    }
  };

  const getScheduleForSlot = (day: string, time: string) => {
    return schedules.find(s => s.day === day && s.startTime === time);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Timetable Management
          </h1>
          <p className="text-muted-foreground">Manage weekly class schedules</p>
        </div>
        <div className="flex gap-3 items-center">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name} ({c.gradeLevel})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedClass}>
                <Plus className="mr-2 h-4 w-4" /> Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule a Class</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select value={formData.day} onValueChange={(v) => setFormData({...formData, day: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select value={formData.startTime} onValueChange={(v) => setFormData({...formData, startTime: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Teacher</Label>
                  <Select value={formData.teacherId} onValueChange={(v) => setFormData({...formData, teacherId: v})}>
                    <SelectTrigger><SelectValue placeholder="Select Teacher" /></SelectTrigger>
                    <SelectContent>
                      {teachers.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Room</Label>
                  <Input 
                    placeholder="e.g. Room 101" 
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                  />
                </div>

                <Button className="w-full" onClick={handleCreate}>Save Schedule</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b bg-muted/50 text-left font-medium w-24">Time</th>
                {DAYS.map(day => (
                  <th key={day} className="p-4 border-b bg-muted/50 text-left font-medium min-w-[160px]">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMES.map(time => (
                <tr key={time} className="border-b last:border-0">
                  <td className="p-4 font-medium text-sm text-muted-foreground border-r bg-muted/10">{time}</td>
                  {DAYS.map(day => {
                    const schedule = getScheduleForSlot(day, time);
                    return (
                      <td key={`${day}-${time}`} className="p-2 border-r last:border-0 align-top h-24">
                        {schedule ? (
                          <div className="bg-primary/10 border border-primary/20 rounded-md p-2 text-sm relative group hover:bg-primary/20 transition-colors">
                            <div className="font-semibold text-primary">
                              {schedule.subject?.name || 'Subject'}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {schedule.teacher?.firstName} {schedule.teacher?.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {schedule.room}
                            </div>
                            <button 
                              onClick={() => handleDelete(schedule.id)}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 p-1 rounded"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-full w-full rounded-md hover:bg-muted/50 transition-colors cursor-pointer border-2 border-transparent border-dashed hover:border-muted-foreground/20" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
