import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, User, Plus, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Appointment } from '../data/demoData';
import { AppointmentDialog } from './AppointmentDialog';

interface AppointmentsViewProps {
  appointments: Appointment[];
}

export function AppointmentsView({ appointments }: AppointmentsViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'reschedule'>('create');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();

  const upcomingAppointments = appointments
    .filter(apt => apt.type === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments
    .filter(apt => apt.type === 'past')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCreateAppointment = () => {
    setDialogMode('create');
    setSelectedAppointment(undefined);
    setDialogOpen(true);
  };

  const handleRescheduleAppointment = (appointment: Appointment) => {
    setDialogMode('reschedule');
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const handleSaveAppointment = (appointment: Appointment) => {
    // In a real app, this would save to a database
    console.log('Saved appointment:', appointment);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(dateString);
    appointmentDate.setHours(0, 0, 0, 0);
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return 'Past';
  };

  const renderAppointmentCard = (appointment: Appointment) => (
    <Card key={appointment.id} className="hover:bg-gray-50 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg mb-1">{appointment.title}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {appointment.doctor} • {appointment.specialty}
                </p>
              </div>
              <Badge variant={getStatusColor(appointment.status)} className="ml-2">
                {appointment.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>{formatDate(appointment.date)}</span>
                {appointment.type === 'upcoming' && (
                  <Badge variant="outline" className="ml-2">
                    {getDaysUntil(appointment.date)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{appointment.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 lg:flex-col">
            <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
              View Details
            </Button>
            {appointment.type === 'upcoming' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 lg:flex-none"
                  onClick={() => handleRescheduleAppointment(appointment)}
                >
                  Reschedule
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 lg:flex-none text-red-600">
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Appointments</h2>
          <p className="text-gray-600">Manage your medical appointments</p>
        </div>
        <Button onClick={handleCreateAppointment}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{upcomingAppointments.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {upcomingAppointments.filter(a => a.status === 'confirmed').length} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {appointments.filter(a => {
                const date = new Date(a.date);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{pastAppointments.length}</div>
            <p className="text-xs text-gray-500 mt-1">Past appointments</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appointment => renderAppointmentCard(appointment))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg mb-2">No upcoming appointments</h3>
                <p className="text-sm text-gray-500 mb-4">Schedule your next appointment to stay on track</p>
                <Button onClick={handleCreateAppointment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastAppointments.length > 0 ? (
            pastAppointments.map(appointment => renderAppointmentCard(appointment))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg mb-2">No past appointments</h3>
                <p className="text-sm text-gray-500">Your appointment history will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={selectedAppointment}
        mode={dialogMode}
        onSave={handleSaveAppointment}
      />
    </div>
  );
}
