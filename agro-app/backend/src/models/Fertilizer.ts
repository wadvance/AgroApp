import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface IFertilizer extends Document {
  name: string;
  type: string; // organic, chemical, etc.
  npkRatio: string; // e.g., '10-10-10'
  suitableFor: string[]; // types of crops
  applicationMethod: string;
  dosage: string;
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FertilizerSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  npkRatio: { type: String, required: true },
  suitableFor: [{ type: String }],
  applicationMethod: { type: String, required: true },
  dosage: { type: String, required: true },
  benefits: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model<IFertilizer>('Fertilizer', FertilizerSchema);