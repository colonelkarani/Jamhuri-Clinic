import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { User, Mail, Phone, Calendar, Ruler, Weight } from 'lucide-react';
import { Separator } from './ui/separator';
import { VitalData } from '../data/demoData';

interface ProfileViewProps {
  vitals: VitalData[];
}

export function ProfileView({ vitals }: ProfileViewProps) {
  // Mock user data - in a real app, this would come from authentication/database
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
    height: '178 cm',
    weight: '79.4 kg',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Hypertension'],
  };

  const age = new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear();
  const memberSince = 'January 2024';
  const totalReadings = vitals.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Profile</h2>
        <p className="text-gray-600">View your account information and health profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl">{userData.name}</h3>
                <p className="text-sm text-gray-500">{userData.email}</p>
                <Badge className="mt-2">Active Member</Badge>
              </div>
              <Separator />
              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Age</p>
                    <p>{age} years old</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="truncate">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p>{userData.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Profile */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Health Profile</CardTitle>
            <CardDescription>Your medical information and physical metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-3">Physical Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Ruler className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Height</span>
                      </div>
                      <span>{userData.height}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Weight</span>
                      </div>
                      <span>{userData.weight}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Blood Type</span>
                      </div>
                      <Badge variant="outline">{userData.bloodType}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Account Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Member Since</span>
                      <span>{memberSince}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Total Readings</span>
                      <Badge>{totalReadings}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-3">Medical Conditions</h4>
                  <div className="space-y-2">
                    {userData.conditions.length > 0 ? (
                      userData.conditions.map((condition, index) => (
                        <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm">{condition}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No conditions recorded</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Allergies</h4>
                  <div className="space-y-2">
                    {userData.allergies.length > 0 ? (
                      userData.allergies.map((allergy, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm">{allergy}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No allergies recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest health tracking activities</CardDescription>
        </CardHeader>
        <CardContent>
          {vitals.length > 0 ? (
            <div className="space-y-3">
              {vitals.slice(0, 5).map((vital, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm">Vitals recorded</p>
                    <p className="text-xs text-gray-500">
                      {new Date(vital.date).toLocaleString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="outline">{vital.heartRate} bpm</Badge>
                    <Badge variant="outline">{vital.systolic}/{vital.diastolic} mmHg</Badge>
                    <Badge variant="outline">{vital.bloodSugar} mmol/L</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
