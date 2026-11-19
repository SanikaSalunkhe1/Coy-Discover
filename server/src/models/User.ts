import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  college: string;
  interests: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18, max: 120 },
    photo: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    interests: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, 'At least one interest is required'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id ? ret._id.toString() : '';
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);

