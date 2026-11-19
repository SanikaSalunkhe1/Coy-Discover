import mongoose, { Document, Schema } from 'mongoose';

export type SwipeAction = 'like' | 'pass';

export interface ISwipe extends Document {
  _id: mongoose.Types.ObjectId;
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  action: SwipeAction;
  createdAt: Date;
}

const SwipeSchema = new Schema<ISwipe>(
  {
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ['like', 'pass'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Unique compound index prevents multiple swipes by the same user on the same target
SwipeSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

export const Swipe = mongoose.model<ISwipe>('Swipe', SwipeSchema);

