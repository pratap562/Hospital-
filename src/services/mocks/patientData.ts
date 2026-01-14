export interface Address {
  street: string;
  city: string;
  state: string;
}

export interface Patient {
  id: string;
  name: string;
  phoneNumber: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  dob: string; // YYYY-MM-DD
  address: Address;
  totalVisits: number;
}

export const mockPatients: Patient[] = [
  {
    id: 'PAT001',
    name: 'Rahul Sharma',
    phoneNumber: '9876543210',
    age: 35,
    sex: 'Male',
    dob: '1991-05-15',
    address: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra' },
    totalVisits: 2,
  },
  {
    id: 'PAT002',
    name: 'Priya Patel',
    phoneNumber: '9876543211',
    age: 28,
    sex: 'Female',
    dob: '1998-08-22',
    address: { street: '45 Nehru Nagar', city: 'Pune', state: 'Maharashtra' },
    totalVisits: 1,
  },
  {
    id: 'PAT003',
    name: 'Amit Kumar',
    phoneNumber: '9876543212',
    age: 42,
    sex: 'Male',
    dob: '1984-02-10',
    address: { street: '78 Gandhi Street', city: 'Delhi', state: 'Delhi' },
    totalVisits: 1,
  },
  {
    id: 'PAT004',
    name: 'Sneha Gupta',
    phoneNumber: '9876543213',
    age: 29,
    sex: 'Female',
    dob: '1996-11-05',
    address: { street: '12 Park Avenue', city: 'Bangalore', state: 'Karnataka' },
    totalVisits: 4,
  },
  {
    id: 'PAT005',
    name: 'Vikram Singh',
    phoneNumber: '9876543214',
    age: 55,
    sex: 'Male',
    dob: '1970-03-12',
    address: { street: '56 Lake View', city: 'Udaipur', state: 'Rajasthan' },
    totalVisits: 2,
  },
  {
    id: 'PAT006',
    name: 'Anjali Rao',
    phoneNumber: '9876543215',
    age: 31,
    sex: 'Female',
    dob: '1994-07-20',
    address: { street: '89 Hill Road', city: 'Hyderabad', state: 'Telangana' },
    totalVisits: 2,
  },
  {
    id: 'PAT005',
    name: 'Vikram Singh',
    phoneNumber: '9876543214',
    age: 55,
    sex: 'Male',
    dob: '1970-03-12',
    address: { street: '56 Lake View', city: 'Udaipur', state: 'Rajasthan' },
    totalVisits: 2,
  },
  {
    id: 'PAT006',
    name: 'Anjali Rao',
    phoneNumber: '9876543215',
    age: 31,
    sex: 'Female',
    dob: '1994-07-20',
    address: { street: '89 Hill Road', city: 'Hyderabad', state: 'Telangana' },
    totalVisits: 2,
  },
  {
    id: 'PAT005',
    name: 'Vikram Singh',
    phoneNumber: '9876543214',
    age: 55,
    sex: 'Male',
    dob: '1970-03-12',
    address: { street: '56 Lake View', city: 'Udaipur', state: 'Rajasthan' },
    totalVisits: 2,
  },
  {
    id: 'PAT006',
    name: 'Anjali Rao',
    phoneNumber: '9876543215',
    age: 31,
    sex: 'Female',
    dob: '1994-07-20',
    address: { street: '89 Hill Road', city: 'Hyderabad', state: 'Telangana' },
    totalVisits: 2,
  },
  {
    id: 'PAT005',
    name: 'Vikram Singh',
    phoneNumber: '9876543214',
    age: 55,
    sex: 'Male',
    dob: '1970-03-12',
    address: { street: '56 Lake View', city: 'Udaipur', state: 'Rajasthan' },
    totalVisits: 2,
  },
  {
    id: 'PAT006',
    name: 'Anjali Rao',
    phoneNumber: '9876543215',
    age: 31,
    sex: 'Female',
    dob: '1994-07-20',
    address: { street: '89 Hill Road', city: 'Hyderabad', state: 'Telangana' },
    totalVisits: 2,
  }
];
