import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model<IChat>('Chat', ChatSchema);