import mongoose, { type Document } from "mongoose";

export interface IConversation extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
  },
  { timestamps: true },
);

// Indexes
conversationSchema.index({ user: 1 });

export const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema,
);
