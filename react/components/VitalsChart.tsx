import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { VitalData } from '../data/demoData';

interface VitalsChartProps {
  data: VitalData[];
}

export function VitalsChart({ data }: VitalsChartProps) {
  const formattedData = data.map((vital) => ({
    ...vital,
    time: new Date(vital.date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  })).reverse();

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vitals History</CardTitle>
          <CardDescription>Your health trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No data recorded yet. Start by recording your vitals above.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vitals History</CardTitle>
        <CardDescription>Your health trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="heartRate">Heart Rate</TabsTrigger>
            <TabsTrigger value="bloodPressure">Blood Pressure</TabsTrigger>
            <TabsTrigger value="bloodSugar">Blood Sugar</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart Rate (bpm)" strokeWidth={2} />
                <Line type="monotone" dataKey="systolic" stroke="#8b5cf6" name="Systolic (mmHg)" strokeWidth={2} />
                <Line type="monotone" dataKey="diastolic" stroke="#a78bfa" name="Diastolic (mmHg)" strokeWidth={2} />
                <Line type="monotone" dataKey="bloodSugar" stroke="#3b82f6" name="Blood Sugar (mg/dL)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="heartRate" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[50, 120]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart Rate (bpm)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="bloodPressure" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[60, 160]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="systolic" stroke="#8b5cf6" name="Systolic (mmHg)" strokeWidth={2} />
                <Line type="monotone" dataKey="diastolic" stroke="#a78bfa" name="Diastolic (mmHg)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="bloodSugar" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[70, 200]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bloodSugar" stroke="#3b82f6" name="Blood Sugar (mg/dL)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
