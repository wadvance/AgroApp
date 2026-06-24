import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface ISeed extends Document {
  name: string;
  scientificName: string;
  type: string;
  description: string;
  imageUrl: string;
  characteristics: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SeedSchema: Schema = new Schema({
  name: { type: String, required: true },
  scientificName: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  characteristics: [{ type: String }],
}, {
  timestamps: true
});

export default mongoose.model<ISeed>('Seed', SeedSchema);