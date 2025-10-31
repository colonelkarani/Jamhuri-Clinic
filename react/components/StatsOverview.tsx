import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, Droplet, Heart, TrendingDown, TrendingUp, Weight } from 'lucide-react';
import { VitalData } from '../data/demoData';

interface StatsOverviewProps {
  data: VitalData[];
}

export function StatsOverview({ data }: StatsOverviewProps) {
  if (data.length === 0) {
    return null;
  }

  const latest = data[0];
  
  const calculateAverage = (key: keyof VitalData) => {
    const values = data.map((d) => d[key] as number);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  const getTrend = (key: keyof VitalData) => {
    if (data.length < 2) return null;
    const latest = data[0][key] as number;
    const previous = data[1][key] as number;
    return latest > previous ? 'up' : latest < previous ? 'down' : 'same';
  };

  const stats = [
    {
      title: 'Heart Rate',
      value: `${latest.heartRate}`,
      unit: 'bpm',
      average: calculateAverage('heartRate'),
      icon: Heart,
      color: 'text-red-500',
      trend: getTrend('heartRate'),
    },
    {
      title: 'Systolic BP',
      value: `${latest.systolic}`,
      unit: 'mmHg',
      average: calculateAverage('systolic'),
      icon: Activity,
      color: 'text-purple-500',
      trend: getTrend('systolic'),
    },
    {
      title: 'Diastolic BP',
      value: `${latest.diastolic}`,
      unit: 'mmHg',
      average: calculateAverage('diastolic'),
      icon: Activity,
      color: 'text-purple-400',
      trend: getTrend('diastolic'),
    },
    {
      title: 'Blood Sugar',
      value: `${latest.bloodSugar}`,
      unit: 'mmol/L',
      average: calculateAverage('bloodSugar'),
      icon: Droplet,
      color: 'text-blue-500',
      trend: getTrend('bloodSugar'),
    },
    {
      title: 'Weight',
      value: `${latest.weight}`,
      unit: 'kg',
      average: calculateAverage('weight'),
      icon: Weight,
      color: 'text-green-500',
      trend: getTrend('weight'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <div className="text-2xl">{stat.value}</div>
              <span className="text-sm text-gray-500">{stat.unit}</span>
              {stat.trend && (
                <div className="ml-auto">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : stat.trend === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  ) : null}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Avg: {stat.average} {stat.unit}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
