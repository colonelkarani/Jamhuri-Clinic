import { Card, CardContent } from './ui/card';
import { Calendar, Clock } from 'lucide-react';

interface WelcomeSectionProps {
  userName?: string;
}

export function WelcomeSection({ userName = 'John' }: WelcomeSectionProps) {
  const currentHour = new Date().getHours();
  let greeting = 'Good morning';
  
  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon';
  } else if (currentHour >= 17) {
    greeting = 'Good evening';
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = today.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl mb-1">{greeting}, {userName}! 👋</h1>
            <p className="text-gray-600">Here's your health summary for today</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
