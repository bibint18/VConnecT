import { ISubscription,Subscription } from '../../models/Subscriptions.js';
import mongoose from 'mongoose';

export interface ISubscriptionRepository {
  saveSubscription(userId: string, subscription: any): Promise<void>;
  getSubscriptionByUserId(userId: string): Promise<ISubscription | null>;
}

export class SubscriptionRepository implements ISubscriptionRepository {
  async saveSubscription(userId: string, subscription: any): Promise<void> {
    await Subscription.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { userId: new mongoose.Types.ObjectId(userId), subscription },
      { upsert: true, new: true }
    );
  }

  async getSubscriptionByUserId(userId: string): Promise<ISubscription | null> {
    return Subscription.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  }
}