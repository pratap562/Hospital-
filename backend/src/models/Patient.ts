import { Document, Schema, model } from 'mongoose';
import { Sex } from '../types';

export interface PatientDocument extends Document {
  name: string;
  email?: string;
  phoneNo?: string;
  age?: number;
  sex?: Sex;
  dob?: Date;
  address?: {
    city?: string;
    state?: string;
    street?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<PatientDocument>(
  {
    name: { type: String, required: true },
    email: { type: String },
    phoneNo: { type: String },
    age: { type: Number },
    sex: { type: String, enum: ['male', 'female', 'other'] },
    dob: { type: Date },
    address: {
      city: { type: String },
      state: { type: String },
      street: { type: String },
    },
  },
  { timestamps: true }
);

export const Patient = model<PatientDocument>('Patient', patientSchema);
