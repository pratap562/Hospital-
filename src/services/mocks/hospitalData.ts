export interface Hospital {
  id: string;
  hospitalId: string;
  name: string;
  city: string;
}

export const mockHospitals: Hospital[] = [
  { id: '1', hospitalId: 'HOSP001', name: 'Sagar Apollo Hospital', city: 'Bangalore' },
  { id: '2', hospitalId: 'HOSP002', name: 'Manipal Hospital', city: 'Bangalore' },
  { id: '3', hospitalId: 'HOSP003', name: 'Fortis Hospital', city: 'Mumbai' },
  { id: '4', hospitalId: 'HOSP004', name: 'Apollo Hospital', city: 'Chennai' },
  { id: '5', hospitalId: 'HOSP005', name: 'AIIMS', city: 'Delhi' },
  { id: '6', hospitalId: 'HOSP006', name: 'Narayana Health', city: 'Bangalore' },
  { id: '7', hospitalId: 'HOSP007', name: 'Medanta', city: 'Gurgaon' },
  { id: '8', hospitalId: 'HOSP008', name: 'Max Super Speciality', city: 'Delhi' },
  { id: '9', hospitalId: 'HOSP009', name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai' },
  { id: '10', hospitalId: 'HOSP010', name: 'Lilavati Hospital', city: 'Mumbai' },
];
