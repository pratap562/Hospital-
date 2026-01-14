import { Document, Schema, Types, model } from 'mongoose';

export interface SlotLockDocument extends Document {
  slotLockId: Types.ObjectId;
  slotWindowId: Types.ObjectId;
  bookingAttemptId: string;
  expiresAt: Date;
  createdAt: Date;
}

const slotLockSchema = new Schema<SlotLockDocument>(
  {
    slotLockId: { type: Schema.Types.ObjectId, auto: true },
    slotWindowId: { type: Schema.Types.ObjectId, ref: 'SlotWindow', required: true, index: true },
    bookingAttemptId: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

slotLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 600 });

export const SlotLock = model<SlotLockDocument>('SlotLock', slotLockSchema);
