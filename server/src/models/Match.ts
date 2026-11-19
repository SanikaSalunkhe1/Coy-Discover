import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  _id: mongoose.Types.ObjectId;
  userOne: mongoose.Types.ObjectId;
  userTwo: mongoose.Types.ObjectId;
  pairKey: string;
  createdAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    userOne: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userTwo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    pairKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

/**
 * Generates a canonical sorted pairKey for any two user IDs.
 * Ensures consistent match uniqueness regardless of who liked first.
 */
export function getPairKey(userAId: string, userBId: string): string {
  return [userAId, userBId].sort().join(':');
}

export const Match = mongoose.model<IMatch>('Match', MatchSchema);

