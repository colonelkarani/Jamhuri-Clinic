import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { VitalData } from '../data/demoData';

interface VitalsTableProps {
  data: VitalData[];
  onDelete: (index: number) => void;
}

export function VitalsTable({ data, onDelete }: VitalsTableProps) {
  const getBloodSugarStatus = (value: number) => {
    if (value < 3.9) return { label: 'Low', variant: 'destructive' as const };
    if (value >= 3.9 && value <= 7.8) return { label: 'Normal', variant: 'default' as const };
    return { label: 'High', variant: 'destructive' as const };
  };

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { label: 'Normal', variant: 'default' as const };
    if (systolic >= 120 && systolic < 130 && diastolic < 80) return { label: 'Elevated', variant: 'secondary' as const };
    if (systolic >= 130 || diastolic >= 80) return { label: 'High', variant: 'destructive' as const };
    return { label: 'Low', variant: 'destructive' as const };
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Readings</CardTitle>
        <CardDescription>Your latest vital measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Heart Rate</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>Blood Sugar</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((vital, index) => {
                const bsStatus = getBloodSugarStatus(vital.bloodSugar);
                const bpStatus = getBloodPressureStatus(vital.systolic, vital.diastolic);
                
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
                    <TableCell>{vital.heartRate} bpm</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {vital.systolic}/{vital.diastolic} mmHg
                        <Badge variant={bpStatus.variant}>{bpStatus.label}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {vital.bloodSugar} mmol/L
                        <Badge variant={bsStatus.variant}>{bsStatus.label}</Badge>
                      </div>
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
  );
}
