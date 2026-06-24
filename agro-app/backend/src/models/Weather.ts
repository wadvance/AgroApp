import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface IWeather extends Document {
  location: string;
  temperature: number; // in Celsius
  humidity: number; // percentage
  rainfall: number; // in mm
  windSpeed: number; // in km/h
  condition: string; // sunny, cloudy, rainy, etc.
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WeatherSchema: Schema = new Schema({
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  rainfall: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  condition: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model<IWeather>('Weather', WeatherSchema);