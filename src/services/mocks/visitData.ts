export interface Vitals {
  pulse: number;
  bp: string;
  temperature: number;
}

export interface OtherProblems {
  acidity: boolean;
  diabetes: boolean;
  constipation: boolean;
  amebiasis: boolean;
  bp: boolean;
  heartProblems: boolean;
  other: string;
}

export interface MedicalHistory {
  disease: string[];
  diseaseDuration: string;
  presentSymptoms: string[];
  previousTreatment: string[];
  treatmentGiven?: string[];
  vitals: Vitals;
  otherProblems: OtherProblems;
  medicinesGiven: string[];
  advice: string;
  followUpDate?: string;
}

export interface Visit {
  id: string;
  tokenNumber: number;
  patientId: string;
  patientName: string;
  phoneNumber: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  dob: string;
  address: string;
  visitDate: string;
  visitTime: string;
  status: 'waiting' | 'done';
  hospitalId: string;
  medicalHistory?: MedicalHistory;
}

export const mockVisits: Visit[] = [
  {
    id: 'VIS001',
    tokenNumber: 1,
    patientId: 'PAT001',
    patientName: 'Rahul Sharma',
    phoneNumber: '9876543210',
    age: 35,
    sex: 'Male',
    dob: '1989-05-15',
    address: '123, MG Road, Mumbai',
    visitDate: '2026-01-14',
    visitTime: '10:00 AM',
    status: 'done',
    hospitalId: '1',
    medicalHistory: {
      disease: ['Hypertension'],
      diseaseDuration: '2 years',
      presentSymptoms: ['Headache', 'Dizziness'],
      previousTreatment: ['Amlodipine 5mg'],
      vitals: { pulse: 78, bp: '140/90', temperature: 98.6 },
      otherProblems: { 
        acidity: true, 
        diabetes: false, 
        constipation: false, 
        amebiasis: false, 
        bp: true, 
        heartProblems: false,
        other: 'Mild anxiety' 
      },
      medicinesGiven: ['Arjuna Arishta', 'Chandraprabha Vati'],
      advice: 'Avoid salty and spicy food. Practice Shavasana and daily morning walk. Take medicines with lukewarm water.'
    }
  },
  {
    id: 'VIS002',
    tokenNumber: 10,
    patientId: 'PAT001',
    patientName: 'Rahul Sharma',
    phoneNumber: '9876543210',
    age: 35,
    sex: 'Male',
    dob: '1989-05-15',
    address: '123, MG Road, Mumbai',
    visitDate: '2025-12-10',
    visitTime: '11:30 AM',
    status: 'done',
    hospitalId: '1',
    medicalHistory: {
      disease: ['Common Cold'],
      diseaseDuration: '3 days',
      presentSymptoms: ['Runny nose', 'Sore throat'],
      previousTreatment: ['None'],
      vitals: { pulse: 72, bp: '120/80', temperature: 100.2 },
      otherProblems: { 
        acidity: false, 
        diabetes: false, 
        constipation: false, 
        amebiasis: false, 
        bp: false, 
        heartProblems: false,
        other: '' 
      },
      medicinesGiven: ['Sitopaladi Churna', 'Amritarishta'],
      advice: 'Take Sitopaladi with honey. Avoid cold drinks and curd. Steam inhalation with Tulsi leaves.'
    }
  },
  {
    id: 'VIS003',
    tokenNumber: 2,
    patientId: 'PAT002',
    patientName: 'Priya Patel',
    phoneNumber: '9123456789',
    age: 28,
    sex: 'Female',
    dob: '1996-08-22',
    address: '45, Satellite Area, Ahmedabad',
    visitDate: '2026-01-14',
    visitTime: '10:15 AM',
    status: 'waiting',
    hospitalId: '1'
  },
  {
    id: 'VIS004',
    tokenNumber: 3,
    patientId: 'PAT003',
    patientName: 'Amit Kumar',
    phoneNumber: '9876543212',
    age: 42,
    sex: 'Male',
    dob: '1984-02-10',
    address: '78 Gandhi Street, Delhi',
    visitDate: '2026-01-14',
    visitTime: '10:30 AM',
    status: 'waiting',
    hospitalId: '1'
  },
  {
    id: 'VIS005',
    tokenNumber: 4,
    patientId: 'PAT004',
    patientName: 'Sneha Gupta',
    phoneNumber: '9876543213',
    age: 29,
    sex: 'Female',
    dob: '1996-11-05',
    address: '12 Park Avenue, Bangalore',
    visitDate: '2026-01-14',
    visitTime: '10:45 AM',
    status: 'waiting',
    hospitalId: '1'
  },
  {
    id: 'VIS006',
    tokenNumber: 11,
    patientId: 'PAT004',
    patientName: 'Sneha Gupta',
    phoneNumber: '9876543213',
    age: 29,
    sex: 'Female',
    dob: '1996-11-05',
    address: '12 Park Avenue, Bangalore',
    visitDate: '2025-12-25',
    visitTime: '04:00 PM',
    status: 'done',
    hospitalId: '1',
    medicalHistory: {
      disease: ['Migraine'],
      diseaseDuration: '5 years',
      presentSymptoms: ['Severe headache', 'Nausea'],
      previousTreatment: ['Naproxen'],
      vitals: { pulse: 82, bp: '110/70', temperature: 98.4 },
      otherProblems: { 
        acidity: true, 
        diabetes: false, 
        constipation: false, 
        amebiasis: false, 
        bp: false, 
        heartProblems: false,
        other: '' 
      },
      medicinesGiven: ['Brahmi Vati', 'Sutashekhar Ras'],
      advice: 'Apply Anu Taila in nostrils. Avoid direct sunlight and loud noises. Take light diet (Pathya).'
    }
  },
  {
    id: 'VIS007',
    tokenNumber: 12,
    patientId: 'PAT004',
    patientName: 'Sneha Gupta',
    phoneNumber: '9876543213',
    age: 29,
    sex: 'Female',
    dob: '1996-11-05',
    address: '12 Park Avenue, Bangalore',
    visitDate: '2025-11-20',
    visitTime: '02:30 PM',
    status: 'done',
    hospitalId: '1',
    medicalHistory: {
      disease: ['Vitamin D Deficiency'],
      diseaseDuration: '1 month',
      presentSymptoms: ['Fatigue', 'Bone pain'],
      previousTreatment: ['None'],
      vitals: { pulse: 75, bp: '115/75', temperature: 98.6 },
      otherProblems: { 
        acidity: false, 
        diabetes: false, 
        constipation: false, 
        amebiasis: false, 
        bp: false, 
        heartProblems: false,
        other: '' 
      },
      medicinesGiven: ['Ashwagandha Churna', 'Laxmivilas Ras'],
      advice: 'Morning sunlight exposure for 20 mins. Take Ashwagandha with warm milk at bedtime.'
    }
  },
  {
    id: 'VIS0071',
    tokenNumber: 124,
    patientId: 'PAT004',
    patientName: 'Sneha Gupta',
    phoneNumber: '9876543213',
    age: 29,
    sex: 'Female',
    dob: '1996-11-05',
    address: '12 Park Avenue, Bangalore',
    visitDate: '2025-10-19',
    visitTime: '02:30 PM',
    status: 'done',
    hospitalId: '2',
    medicalHistory: {
      disease: ['Vitamin E Deficiency'],
      diseaseDuration: '1 month',
      presentSymptoms: ['Fatigue', 'Bone pain'],
      previousTreatment: ['None'],
      vitals: { pulse: 75, bp: '115/75', temperature: 98.6 },
      otherProblems: { 
        acidity: false, 
        diabetes: false, 
        constipation: false, 
        amebiasis: false, 
        bp: false, 
        heartProblems: false,
        other: '' 
      },
      medicinesGiven: ['Shatavari Kalpa', 'Chyawanprash'],
      advice: 'Take 1 tsp Chyawanprash daily. Include almonds and walnuts in diet.'
    }
  },
  {
    id: 'VIS008',
    tokenNumber: 5,
    patientId: 'PAT005',
    patientName: 'Vikram Singh',
    phoneNumber: '9876543214',
    age: 55,
    sex: 'Male',
    dob: '1970-03-12',
    address: '56 Lake View, Udaipur',
    visitDate: '2026-01-14',
    visitTime: '11:00 AM',
    status: 'waiting',
    hospitalId: '1'
  },
  {
    id: 'VIS009',
    tokenNumber: 13,
    patientId: 'PAT005',
    patientName: 'Vikram Singh',
    phoneNumber: '9876543214',
    age: 55,
    sex: 'Male',
    dob: '1970-03-12',
    address: '56 Lake View, Udaipur',
    visitDate: '2025-10-15',
    visitTime: '09:00 AM',
    status: 'done',
    hospitalId: '1',
    medicalHistory: {
      disease: ['Type 2 Diabetes'],
      diseaseDuration: '10 years',
      presentSymptoms: ['Increased thirst', 'Frequent urination'],
      previousTreatment: ['Metformin 500mg'],
      vitals: { pulse: 80, bp: '130/85', temperature: 98.2 },
      otherProblems: { 
        acidity: false, 
        diabetes: true, 
        constipation: true, 
        amebiasis: false, 
        bp: false, 
        heartProblems: false,
        other: '' 
      },
      medicinesGiven: ['Chandraprabha Vati', 'Arogyavardhini Vati'],
      advice: 'Strictly avoid sugar and sweets. Include bitter gourd (Karela) in diet. Regular Yoga and Pranayama.'
    }
  },
  {
    id: 'VIS010',
    tokenNumber: 6,
    patientId: 'PAT006',
    patientName: 'Anjali Rao',
    phoneNumber: '9876543215',
    age: 31,
    sex: 'Female',
    dob: '1994-07-20',
    address: '89 Hill Road, Hyderabad',
    visitDate: '2026-01-14',
    visitTime: '11:15 AM',
    status: 'waiting',
    hospitalId: '1'
  },
  {
    id: 'VIS011',
    tokenNumber: 14,
    patientId: 'PAT006',
    patientName: 'Anjali Rao',
    phoneNumber: '9876543215',
    age: 31,
    sex: 'Female',
    dob: '1994-07-20',
    address: '89 Hill Road, Hyderabad',
    visitDate: '2026-01-05',
    visitTime: '12:00 PM',
    status: 'done',
    hospitalId: '1',
    medicalHistory: {
      disease: ['Acute Gastritis'],
      diseaseDuration: '2 days',
      presentSymptoms: ['Stomach pain', 'Burning sensation'],
      previousTreatment: ['Antacids'],
      vitals: { pulse: 76, bp: '120/80', temperature: 99.0 },
      otherProblems: { 
        acidity: true, 
        diabetes: false, 
        constipation: false, 
        amebiasis: false, 
        bp: false, 
        heartProblems: false,
        other: '' 
      },
      medicinesGiven: ['Avipattikar Churna', 'Kamadudha Ras'],
      advice: 'Take Avipattikar with coconut water. Avoid tea, coffee, and spicy food. Drink plenty of water.'
    }
  }
];
