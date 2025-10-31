import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Appointment } from '../data/demoData';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment;
  mode: 'create' | 'reschedule';
  onSave: (appointment: Appointment) => void;
}

export function AppointmentDialog({ open, onOpenChange, appointment, mode, onSave }: AppointmentDialogProps) {
  const [title, setTitle] = useState(appointment?.title || '');
  const [doctor, setDoctor] = useState(appointment?.doctor || '');
  const [specialty, setSpecialty] = useState(appointment?.specialty || '');
  const [date, setDate] = useState(appointment?.date || '');
  const [time, setTime] = useState(appointment?.time || '');
  const [location, setLocation] = useState(appointment?.location || '');

  const specialties = [
    'General Practitioner',
    'Cardiologist',
    'Endocrinologist',
    'Neurologist',
    'Dermatologist',
    'Ophthalmologist',
    'Dentist',
    'Physiotherapist',
    'Psychiatrist',
    'Paediatrician',
    'Laboratory',
    'Nursing',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !doctor || !specialty || !date || !time || !location) {
      toast.error('Please fill in all fields');
      return;
    }

    const newAppointment: Appointment = {
      id: appointment?.id || `apt-${Date.now()}`,
      title,
      doctor,
      specialty,
      date,
      time,
      location,
      type: new Date(date) >= new Date() ? 'upcoming' : 'past',
      status: mode === 'reschedule' ? 'confirmed' : 'pending',
    };

    onSave(newAppointment);
    
    if (mode === 'create') {
      toast.success('Appointment scheduled successfully!');
    } else {
      toast.success('Appointment rescheduled successfully!');
    }
    
    onOpenChange(false);
    
    // Reset form
    setTitle('');
    setDoctor('');
    setSpecialty('');
    setDate('');
    setTime('');
    setLocation('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Schedule New Appointment' : 'Reschedule Appointment'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Fill in the details to schedule a new medical appointment.'
              : 'Update the appointment details to reschedule.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Appointment Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Annual Physical Exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor/Healthcare Provider *</Label>
              <Input
                id="doctor"
                placeholder="e.g., Dr. Sarah Johnson"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty *</Label>
              <Select value={specialty} onValueChange={setSpecialty} required>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Textarea
              id="location"
              placeholder="e.g., Main Medical Centre - Room 305"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              rows={2}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Schedule Appointment' : 'Reschedule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
