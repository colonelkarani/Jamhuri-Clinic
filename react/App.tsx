import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { WelcomeSection } from './components/WelcomeSection';
import { OverviewView } from './components/OverviewView';
import { VitalsView } from './components/VitalsView';
import { BloodSugarView } from './components/BloodSugarView';
import { TrendsView } from './components/TrendsView';
import { AppointmentsView } from './components/AppointmentsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { Toaster } from './components/ui/sonner';
import { demoVitals, demoAppointments, VitalData } from './data/demoData';

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [vitals, setVitals] = useState<VitalData[]>(() => {
    const saved = localStorage.getItem('healthTrackerVitals');
    if (saved) {
      const parsedData = JSON.parse(saved);
      // If we have saved data, use it, otherwise use demo data
      return parsedData.length > 0 ? parsedData : demoVitals;
    }
    return demoVitals;
  });

  useEffect(() => {
    localStorage.setItem('healthTrackerVitals', JSON.stringify(vitals));
  }, [vitals]);

  const handleAddVital = (vital: VitalData) => {
    setVitals([vital, ...vitals]);
  };

  const handleDeleteVital = (index: number) => {
    setVitals(vitals.filter((_, i) => i !== index));
  };

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView vitals={vitals} appointments={demoAppointments} onAddVital={handleAddVital} />;
      case 'vitals':
        return <VitalsView vitals={vitals} onDelete={handleDeleteVital} />;
      case 'blood-sugar':
        return <BloodSugarView vitals={vitals} onDelete={handleDeleteVital} />;
      case 'trends':
        return <TrendsView vitals={vitals} />;
      case 'appointments':
        return <AppointmentsView appointments={demoAppointments} />;
      case 'profile':
        return <ProfileView vitals={vitals} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView vitals={vitals} appointments={demoAppointments} onAddVital={handleAddVital} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Toaster />
        
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center gap-2">
            <SidebarTrigger />
            <div className="flex-1" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-6">
              <WelcomeSection userName="John" />
              {renderView()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
