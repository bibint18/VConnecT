import { NextFunction, Request, Response } from "express";
import { IDirectCallRepository } from "../../../interfaces/user/Call/IDirectCallRepository.js";
import { HTTP_STATUS_CODE } from "../../../utils/statusCode.js";
import { IDirectCallController } from "../../../interfaces/Admin/Report/IDirectCallController.js";

export class DirectCallController implements IDirectCallController {
  private directCallRepository: IDirectCallRepository;
  constructor(directCallRepository: IDirectCallRepository) {
    this.directCallRepository = directCallRepository;
  }

  async getCallDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const callId = req.query.callId as string;
      if (!callId) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: "Call ID is required" });
        return
      }
      const call = await this.directCallRepository.getCallById(callId);
      if (!call) {
         res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: "Call not found" });
         return
      }
      if (call.callerId.toString() !== (req as any).user.id && call.receiverId.toString() !== (req as any).user.id) {
        res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: "Unauthorized to access this call" });
        return
      }
      res.json({
        call: {
          callerId: call.callerId.toString(),
          receiverId: call.receiverId.toString(),
          status: call.status,
        },
      });
    } catch (error) {
      next(error)
    }
  }
}