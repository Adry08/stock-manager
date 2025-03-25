import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  role: string; // Par exemple: 'admin', 'user'
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<User>('User', UserSchema);