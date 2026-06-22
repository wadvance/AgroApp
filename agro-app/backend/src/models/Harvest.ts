import mongoose, { Schema, Document } from 'mongoose';

export interface IHarvest extends Document {
  cropType: string;
  area: number; // in hectares
  expectedYield: number; // in tons
  actualYield: number; // in tons
  plantingDate: Date;
  expectedHarvestDate: Date;
  actualHarvestDate: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const HarvestSchema: Schema = new Schema({
  cropType: { type: String, required: true },
  area: { type: Number, required: true },
  expectedYield: { type: Number, required: true },
  actualYield: { type: Number },
  plantingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date, required: true },
  actualHarvestDate: { type: Date },
  notes: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IHarvest>('Harvest', HarvestSchema);