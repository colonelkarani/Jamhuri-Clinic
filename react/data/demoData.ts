export interface VitalData {
  date: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  bloodSugar: number; // in mmol/L (British)
  weight: number; // in kg (British)
}

export interface Appointment {
  id: string;
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  type: 'upcoming' | 'past';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

// Generate demo vitals data for the past 30 days (British metrics: kg, mmol/L)
export const demoVitals: VitalData[] = [
  { date: '2025-10-30T08:00:00', heartRate: 72, systolic: 118, diastolic: 78, bloodSugar: 5.3, weight: 79.4 },
  { date: '2025-10-29T08:15:00', heartRate: 75, systolic: 120, diastolic: 80, bloodSugar: 5.4, weight: 79.6 },
  { date: '2025-10-28T07:45:00', heartRate: 70, systolic: 116, diastolic: 76, bloodSugar: 5.1, weight: 79.8 },
  { date: '2025-10-27T08:30:00', heartRate: 74, systolic: 122, diastolic: 82, bloodSugar: 5.6, weight: 79.9 },
  { date: '2025-10-26T08:00:00', heartRate: 71, systolic: 119, diastolic: 79, bloodSugar: 5.3, weight: 80.1 },
  { date: '2025-10-25T09:00:00', heartRate: 73, systolic: 121, diastolic: 81, bloodSugar: 5.5, weight: 80.3 },
  { date: '2025-10-24T08:20:00', heartRate: 76, systolic: 123, diastolic: 83, bloodSugar: 5.7, weight: 80.4 },
  { date: '2025-10-23T07:50:00', heartRate: 69, systolic: 115, diastolic: 75, bloodSugar: 5.0, weight: 80.5 },
  { date: '2025-10-22T08:10:00', heartRate: 72, systolic: 118, diastolic: 78, bloodSugar: 5.2, weight: 80.7 },
  { date: '2025-10-21T08:30:00', heartRate: 74, systolic: 120, diastolic: 80, bloodSugar: 5.4, weight: 80.8 },
  { date: '2025-10-20T08:00:00', heartRate: 70, systolic: 117, diastolic: 77, bloodSugar: 5.2, weight: 81.0 },
  { date: '2025-10-19T09:15:00', heartRate: 75, systolic: 122, diastolic: 82, bloodSugar: 5.6, weight: 81.2 },
  { date: '2025-10-18T08:00:00', heartRate: 71, systolic: 119, diastolic: 79, bloodSugar: 5.3, weight: 81.3 },
  { date: '2025-10-17T07:45:00', heartRate: 73, systolic: 121, diastolic: 81, bloodSugar: 5.4, weight: 81.4 },
  { date: '2025-10-16T08:20:00', heartRate: 77, systolic: 124, diastolic: 84, bloodSugar: 5.8, weight: 81.6 },
  { date: '2025-10-15T08:00:00', heartRate: 72, systolic: 118, diastolic: 78, bloodSugar: 5.2, weight: 81.8 },
  { date: '2025-10-14T08:30:00', heartRate: 70, systolic: 116, diastolic: 76, bloodSugar: 5.1, weight: 81.9 },
  { date: '2025-10-13T09:00:00', heartRate: 74, systolic: 120, diastolic: 80, bloodSugar: 5.3, weight: 82.1 },
  { date: '2025-10-12T08:15:00', heartRate: 71, systolic: 117, diastolic: 77, bloodSugar: 5.2, weight: 82.2 },
  { date: '2025-10-11T07:50:00', heartRate: 73, systolic: 119, diastolic: 79, bloodSugar: 5.4, weight: 82.3 },
  { date: '2025-10-10T08:00:00', heartRate: 75, systolic: 121, diastolic: 81, bloodSugar: 5.5, weight: 82.6 },
  { date: '2025-10-09T08:30:00', heartRate: 72, systolic: 118, diastolic: 78, bloodSugar: 5.3, weight: 82.7 },
  { date: '2025-10-08T08:00:00', heartRate: 76, systolic: 123, diastolic: 83, bloodSugar: 5.7, weight: 82.8 },
  { date: '2025-10-07T09:15:00', heartRate: 70, systolic: 116, diastolic: 76, bloodSugar: 5.1, weight: 83.0 },
  { date: '2025-10-06T08:00:00', heartRate: 74, systolic: 120, diastolic: 80, bloodSugar: 5.3, weight: 83.1 },
  { date: '2025-10-05T07:45:00', heartRate: 71, systolic: 117, diastolic: 77, bloodSugar: 5.2, weight: 83.2 },
  { date: '2025-10-04T08:20:00', heartRate: 73, systolic: 119, diastolic: 79, bloodSugar: 5.4, weight: 83.5 },
  { date: '2025-10-03T08:00:00', heartRate: 75, systolic: 122, diastolic: 82, bloodSugar: 5.6, weight: 83.6 },
  { date: '2025-10-02T08:30:00', heartRate: 72, systolic: 118, diastolic: 78, bloodSugar: 5.3, weight: 83.7 },
  { date: '2025-10-01T08:00:00', heartRate: 74, systolic: 120, diastolic: 80, bloodSugar: 5.4, weight: 83.9 },
];

export const demoAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Annual Physical Exam',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'General Practitioner',
    date: '2025-11-05',
    time: '10:00 AM',
    location: 'Main Medical Center - Room 305',
    type: 'upcoming',
    status: 'confirmed',
  },
  {
    id: '2',
    title: 'Cardiology Follow-up',
    doctor: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    date: '2025-11-12',
    time: '2:30 PM',
    location: 'Heart & Vascular Institute',
    type: 'upcoming',
    status: 'confirmed',
  },
  {
    id: '3',
    title: 'Blood Work & Lab Tests',
    doctor: 'Lab Technician',
    specialty: 'Laboratory',
    date: '2025-11-08',
    time: '8:00 AM',
    location: 'Medical Plaza - Lab Services',
    type: 'upcoming',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Diabetes Management',
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'Endocrinologist',
    date: '2025-11-20',
    time: '11:30 AM',
    location: 'Diabetes Care Center',
    type: 'upcoming',
    status: 'confirmed',
  },
  {
    id: '5',
    title: 'Routine Checkup',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'General Practitioner',
    date: '2025-10-15',
    time: '10:00 AM',
    location: 'Main Medical Center - Room 305',
    type: 'past',
    status: 'completed',
  },
  {
    id: '6',
    title: 'Blood Pressure Monitoring',
    doctor: 'Nurse Thompson',
    specialty: 'Nursing',
    date: '2025-10-08',
    time: '9:00 AM',
    location: 'Main Medical Center - Room 101',
    type: 'past',
    status: 'completed',
  },
];
