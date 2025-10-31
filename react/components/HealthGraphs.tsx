import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { VitalData } from '../data/demoData';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface HealthGraphsProps {
  data: VitalData[];
}

export function HealthGraphs({ data }: HealthGraphsProps) {
  const formattedData = data.map((vital) => ({
    ...vital,
    date: new Date(vital.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  })).reverse();

  // Calculate trends
  const calculateTrend = (key: keyof VitalData) => {
    if (data.length < 2) return { direction: 'stable', value: 0 };
    const latest = data[0][key] as number;
    const previous = data[data.length - 1][key] as number;
    const change = latest - previous;
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      value: Math.abs(change).toFixed(1),
    };
  };

  const weightTrend = calculateTrend('weight');
  const bsTrend = calculateTrend('bloodSugar');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weight Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weight Trend</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {weightTrend.direction === 'down' ? (
                <>
                  <TrendingDown className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-600">-{weightTrend.value} kg</span>
                </>
              ) : weightTrend.direction === 'up' ? (
                <>
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-red-600">+{weightTrend.value} kg</span>
                </>
              ) : (
                <span className="text-sm text-gray-500">No change</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[78, 85]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#weightGradient)" 
                strokeWidth={2}
                name="Weight (kg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Blood Sugar Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Blood Sugar Levels</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {bsTrend.direction === 'down' ? (
                <>
                  <TrendingDown className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-600">-{bsTrend.value} mmol/L</span>
                </>
              ) : bsTrend.direction === 'up' ? (
                <>
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-red-600">+{bsTrend.value} mmol/L</span>
                </>
              ) : (
                <span className="text-sm text-gray-500">No change</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="bloodSugarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[4.5, 6.5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="bloodSugar" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#bloodSugarGradient)" 
                strokeWidth={2}
                name="Blood Sugar (mmol/L)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Blood Pressure Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Blood Pressure Trend</CardTitle>
          <CardDescription>Systolic and Diastolic readings over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[70, 130]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="systolic" 
                stroke="#ef4444" 
                strokeWidth={2} 
                name="Systolic (mmHg)"
                dot={{ fill: '#ef4444', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="diastolic" 
                stroke="#f97316" 
                strokeWidth={2} 
                name="Diastolic (mmHg)"
                dot={{ fill: '#f97316', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
