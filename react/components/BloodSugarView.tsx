import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Droplet, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { VitalData } from '../data/demoData';

interface BloodSugarViewProps {
  vitals: VitalData[];
  onDelete: (index: number) => void;
}

export function BloodSugarView({ vitals, onDelete }: BloodSugarViewProps) {
  const latestVital = vitals[0];
  
  const getBloodSugarStatus = (value: number) => {
    if (value < 3.9) return { label: 'Low', variant: 'destructive' as const, color: 'text-red-600', description: 'Hypoglycaemia - consult your doctor' };
    if (value >= 3.9 && value <= 5.5) return { label: 'Normal (Fasting)', variant: 'default' as const, color: 'text-green-600', description: 'Optimal fasting glucose level' };
    if (value > 5.5 && value <= 7.8) return { label: 'Normal (Post-meal)', variant: 'default' as const, color: 'text-green-600', description: 'Acceptable post-meal level' };
    if (value > 7.8 && value <= 11.0) return { label: 'Prediabetes', variant: 'secondary' as const, color: 'text-yellow-600', description: 'Elevated - lifestyle changes recommended' };
    return { label: 'High', variant: 'destructive' as const, color: 'text-red-600', description: 'Hyperglycaemia - consult your doctor' };
  };

  const formattedData = vitals.map((vital) => ({
    ...vital,
    time: new Date(vital.date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  })).reverse();

  const averageBloodSugar = vitals.length > 0
    ? (vitals.reduce((sum, v) => sum + v.bloodSugar, 0) / vitals.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Blood Sugar</h2>
        <p className="text-gray-600">Track your glucose levels</p>
      </div>

      {latestVital && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                Current Level
              </CardTitle>
              <CardDescription>Latest blood sugar reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl">{latestVital.bloodSugar}</span>
                  <span className="text-gray-500">mmol/L</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getBloodSugarStatus(latestVital.bloodSugar).variant}>
                    {getBloodSugarStatus(latestVital.bloodSugar).label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(latestVital.date).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{getBloodSugarStatus(latestVital.bloodSugar).description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Level</CardTitle>
              <CardDescription>Based on all recorded readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl">{averageBloodSugar}</span>
                  <span className="text-gray-500">mmol/L</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">Healthy ranges:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Fasting: 3.9-5.5 mmol/L</li>
                    <li>Post-meal: 3.9-7.8 mmol/L</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {vitals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Blood Sugar Trend</CardTitle>
            <CardDescription>Your glucose levels over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[2, 14]} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={3.9} stroke="#ef4444" strokeDasharray="3 3" label="Low" />
                <ReferenceLine y={5.5} stroke="#22c55e" strokeDasharray="3 3" label="Normal (Fasting)" />
                <ReferenceLine y={7.8} stroke="#eab308" strokeDasharray="3 3" label="Normal (Post-meal)" />
                <Line type="monotone" dataKey="bloodSugar" stroke="#3b82f6" name="Blood Sugar (mmol/L)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {vitals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reading History</CardTitle>
            <CardDescription>All recorded blood sugar measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Blood Sugar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vitals.map((vital, index) => {
                    const status = getBloodSugarStatus(vital.bloodSugar);
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(vital.date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>{vital.bloodSugar} mmol/L</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
