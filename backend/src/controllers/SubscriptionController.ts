// New: Controller for subscription endpoints
import { Request, Response, NextFunction } from 'express';
import { ISubscriptionRepository } from '../repositories/User/SubscriptionRepository.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS_CODE } from '../utils/statusCode.js';

export class SubscriptionController {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async saveSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, subscription } = req.body;
      if (!userId || !subscription) {
        throw new AppError('User ID and subscription are required', 400);
      }
      await this.subscriptionRepository.saveSubscription(userId, subscription);
      res.status(HTTP_STATUS_CODE.OK).json({ success: true, message: 'Subscription saved' });
    } catch (error) {
      next(error);
    }
  }
}