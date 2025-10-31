import { VitalForm } from './VitalForm';
import { StatsOverview } from './StatsOverview';
import { HealthGraphs } from './HealthGraphs';
import { AppointmentsSection } from './AppointmentsSection';
import { VitalData, Appointment } from '../data/demoData';

interface OverviewViewProps {
  vitals: VitalData[];
  appointments: Appointment[];
  onAddVital: (vital: VitalData) => void;
}

export function OverviewView({ vitals, appointments, onAddVital }: OverviewViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Overview</h2>
        <p className="text-gray-600">Your current health metrics at a glance</p>
      </div>
      
      <StatsOverview data={vitals} />
      
      <HealthGraphs data={vitals} />
      
      <AppointmentsSection appointments={appointments} />
      
      <VitalForm onAddVital={onAddVital} />
    </div>
  );
}
