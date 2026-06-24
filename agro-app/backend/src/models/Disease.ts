import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface IDisease extends Document {
  name: string;
  scientificName: string;
  affectedPlants: string[];
  symptoms: string[];
  treatment: string;
  prevention: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const DiseaseSchema: Schema = new Schema({
  name: { type: String, required: true },
  scientificName: { type: String, required: true },
  affectedPlants: [{ type: String }],
  symptoms: [{ type: String }],
  treatment: { type: String, required: true },
  prevention: { type: String, required: true },
  imageUrl: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IDisease>('Disease', DiseaseSchema);