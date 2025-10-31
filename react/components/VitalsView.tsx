import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { VitalsTable } from './VitalsTable';
import { Badge } from './ui/badge';
import { Heart, Activity } from 'lucide-react';
import { VitalData } from '../data/demoData';

interface VitalsViewProps {
  vitals: VitalData[];
  onDelete: (index: number) => void;
}

export function VitalsView({ vitals, onDelete }: VitalsViewProps) {
  const latestVital = vitals[0];
  
  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { label: 'Low', variant: 'secondary' as const, color: 'text-yellow-600' };
    if (hr >= 60 && hr <= 100) return { label: 'Normal', variant: 'default' as const, color: 'text-green-600' };
    return { label: 'High', variant: 'destructive' as const, color: 'text-red-600' };
  };

  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { label: 'Normal', variant: 'default' as const, color: 'text-green-600' };
    if (systolic >= 120 && systolic < 130 && diastolic < 80) return { label: 'Elevated', variant: 'secondary' as const, color: 'text-yellow-600' };
    if (systolic >= 130 || diastolic >= 80) return { label: 'High', variant: 'destructive' as const, color: 'text-red-600' };
    return { label: 'Low', variant: 'secondary' as const, color: 'text-yellow-600' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Vital Signs</h2>
        <p className="text-gray-600">Monitor your heart rate and blood pressure</p>
      </div>

      {latestVital && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Heart Rate
              </CardTitle>
              <CardDescription>Latest reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl">{latestVital.heartRate}</span>
                  <span className="text-gray-500">bpm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getHeartRateStatus(latestVital.heartRate).variant}>
                    {getHeartRateStatus(latestVital.heartRate).label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(latestVital.date).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">Normal range: 60-100 bpm</p>
                  <p>Your heart rate is {getHeartRateStatus(latestVital.heartRate).label.toLowerCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                Blood Pressure
              </CardTitle>
              <CardDescription>Latest reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl">{latestVital.systolic}/{latestVital.diastolic}</span>
                  <span className="text-gray-500">mmHg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getBPStatus(latestVital.systolic, latestVital.diastolic).variant}>
                    {getBPStatus(latestVital.systolic, latestVital.diastolic).label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(latestVital.date).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">Normal range: &lt;120/80 mmHg</p>
                  <p>Your blood pressure is {getBPStatus(latestVital.systolic, latestVital.diastolic).label.toLowerCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <VitalsTable data={vitals} onDelete={onDelete} />
    </div>
  );
}
