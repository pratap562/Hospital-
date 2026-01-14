import { Document, Schema, model } from 'mongoose';

export interface HospitalDocument extends Document {
  hospitalId: string;
  name: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

const hospitalSchema = new Schema<HospitalDocument>(
  {
    hospitalId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

export const Hospital = model<HospitalDocument>('Hospital', hospitalSchema);
