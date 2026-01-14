import { Document, Schema, Types, model } from "mongoose";
import { VisitStatus } from "../types";

export interface VisitDocument extends Document {
  visitToken: number;
  patientId: string;
  hospitalId: Types.ObjectId;
  doctorId: Types.ObjectId;
  status: VisitStatus;
  disease?: string;
  diseaseDuration?: string;
  presentSymptoms?: string;
  previousTreatment?: string;
  vitals?: {
    pulse?: number;
    bp?: string;
    temperature?: number;
  };
  otherProblems?: {
    acidity?: boolean;
    diabetes?: boolean;
    constipation?: boolean;
    amebiasis?: boolean;
    bp?: boolean;
    other?: string;
  };
  medicinesGiven?: string[];
  advice?: string;
  followUpDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const visitSchema = new Schema<VisitDocument>(
  {
    visitToken: { type: Number, required: true },
    patientId: { type: String, required: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["waiting", "done"], required: true },
    disease: { type: String },
    diseaseDuration: { type: String },
    presentSymptoms: { type: String },
    previousTreatment: { type: String },
    vitals: {
      pulse: { type: Number },
      bp: { type: String },
      temperature: { type: Number },
    },
    otherProblems: {
      acidity: { type: Boolean },
      diabetes: { type: Boolean },
      constipation: { type: Boolean },
      amebiasis: { type: Boolean },
      bp: { type: Boolean },
      other: { type: String },
    },
    medicinesGiven: [{ type: String }],
    advice: { type: String },
    followUpDate: { type: String },
  },
  { timestamps: true }
);

export const Visit = model<VisitDocument>("Visit", visitSchema);
