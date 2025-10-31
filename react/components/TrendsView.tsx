import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { VitalData } from '../data/demoData';

interface TrendsViewProps {
  vitals: VitalData[];
}

export function TrendsView({ vitals }: TrendsViewProps) {
  const [timeRange, setTimeRange] = useState('7days');

  const filterDataByTimeRange = (data: VitalData[]) => {
    const now = new Date();
    const ranges: { [key: string]: number } = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      'all': Infinity,
    };
    
    const days = ranges[timeRange];
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return data.filter(v => new Date(v.date) >= cutoff);
  };

  const filteredData = filterDataByTimeRange(vitals);

  const formattedData = filteredData.map((vital) => ({
    ...vital,
    time: new Date(vital.date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  })).reverse();

  const calculateTrend = (metric: keyof VitalData) => {
    if (filteredData.length < 2) return null;
    
    const recent = filteredData.slice(0, Math.min(3, filteredData.length));
    const older = filteredData.slice(Math.max(0, filteredData.length - 3));
    
    const recentAvg = recent.reduce((sum, v) => sum + (v[metric] as number), 0) / recent.length;
    const olderAvg = older.reduce((sum, v) => sum + (v[metric] as number), 0) / older.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      percentage: Math.abs(change).toFixed(1),
    };
  };

  const trends = [
    { label: 'Heart Rate', metric: 'heartRate' as keyof VitalData, unit: 'bpm' },
    { label: 'Systolic BP', metric: 'systolic' as keyof VitalData, unit: 'mmHg' },
    { label: 'Diastolic BP', metric: 'diastolic' as keyof VitalData, unit: 'mmHg' },
    { label: 'Blood Sugar', metric: 'bloodSugar' as keyof VitalData, unit: 'mmol/L' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl mb-1">Health Trends</h2>
          <p className="text-gray-600">Analyze your health patterns over time</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trends.map(({ label, metric, unit }) => {
              const trend = calculateTrend(metric);
              const average = filteredData.reduce((sum, v) => sum + (v[metric] as number), 0) / filteredData.length;
              
              return (
                <Card key={label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl mb-1">{average.toFixed(1)} <span className="text-sm text-gray-500">{unit}</span></div>
                    {trend && (
                      <div className="flex items-center gap-1 text-sm">
                        {trend.direction === 'up' ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-red-500" />
                            <span className="text-red-500">+{trend.percentage}%</span>
                          </>
                        ) : trend.direction === 'down' ? (
                          <>
                            <TrendingDown className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">-{trend.percentage}%</span>
                          </>
                        ) : (
                          <span className="text-gray-500">No change</span>
                        )}
                        <span className="text-gray-500 ml-1">vs. baseline</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Vitals Over Time</CardTitle>
              <CardDescription>Compare all your health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart Rate (bpm)" strokeWidth={2} />
                  <Line type="monotone" dataKey="systolic" stroke="#8b5cf6" name="Systolic (mmHg)" strokeWidth={2} />
                  <Line type="monotone" dataKey="diastolic" stroke="#a78bfa" name="Diastolic (mmHg)" strokeWidth={2} />
                  <Line type="monotone" dataKey="bloodSugar" stroke="#3b82f6" name="Blood Sugar (mmol/L)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Average Heart Rate by Day</CardTitle>
                <CardDescription>Daily averages over selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[50, 120]} />
                    <Tooltip />
                    <Bar dataKey="heartRate" fill="#ef4444" name="Heart Rate (bpm)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blood Sugar Distribution</CardTitle>
                <CardDescription>Glucose levels throughout the period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[50, 200]} />
                    <Tooltip />
                    <Bar dataKey="bloodSugar" fill="#3b82f6" name="Blood Sugar (mmol/L)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-[300px] text-gray-500">
            No data available for the selected time range
          </CardContent>
        </Card>
      )}
    </div>
  );
}
