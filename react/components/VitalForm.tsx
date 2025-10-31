import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Activity, Droplet, Heart, Weight } from 'lucide-react';
import { VitalData } from '../data/demoData';

interface VitalFormProps {
  onAddVital: (vital: VitalData) => void;
}

export function VitalForm({ onAddVital }: VitalFormProps) {
  const [heartRate, setHeartRate] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!heartRate || !systolic || !diastolic || !bloodSugar || !weight) {
      toast.error('Please fill in all fields');
      return;
    }

    const newVital: VitalData = {
      date: new Date().toISOString(),
      heartRate: parseInt(heartRate),
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      bloodSugar: parseFloat(bloodSugar),
      weight: parseFloat(weight),
    };

    onAddVital(newVital);
    
    // Reset form
    setHeartRate('');
    setSystolic('');
    setDiastolic('');
    setBloodSugar('');
    setWeight('');
    
    toast.success('Vitals recorded successfully!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Vitals</CardTitle>
        <CardDescription>Enter your current health measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate" className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Heart Rate (bpm)
              </Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="72"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                min="40"
                max="200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodSugar" className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-blue-500" />
                Blood Sugar (mmol/L)
              </Label>
              <Input
                id="bloodSugar"
                type="number"
                placeholder="5.5"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
                min="2.0"
                max="25.0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systolic" className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                Systolic BP (mmHg)
              </Label>
              <Input
                id="systolic"
                type="number"
                placeholder="120"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                min="70"
                max="200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diastolic">Diastolic BP (mmHg)</Label>
              <Input
                id="diastolic"
                type="number"
                placeholder="80"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                min="40"
                max="130"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-green-500" />
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="80"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="20"
                max="250"
                step="0.1"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Record Vitals
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
