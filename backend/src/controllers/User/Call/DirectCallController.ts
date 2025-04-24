import { Request, Response } from "express";
import { IDirectCallRepository } from "../../../interfaces/user/Call/IDirectCallRepository";
import { nextTick } from "process";

export class DirectCallController {
  private directCallRepository: IDirectCallRepository;

  constructor(directCallRepository: IDirectCallRepository) {
    this.directCallRepository = directCallRepository;
  }

  async getCallDetails(req: Request, res: Response) {
    console.log("reached get call detailllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll")
    try {
      const callId = req.query.callId as string;
      console.log("call id from directcall controller",callId)
      if (!callId) {
        res.status(400).json({ message: "Call ID is required" });
        return
      }
      const call = await this.directCallRepository.getCallById(callId);
      console.log("Callllll",call)
      if (!call) {
         res.status(404).json({ message: "Call not found" });
         return
      }
      if (call.callerId.toString() !== (req as any).user.id && call.receiverId.toString() !== (req as any).user.id) {
        res.status(403).json({ message: "Unauthorized to access this call" });
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
      console.error("Error fetching call details:", error);
      res.status(500).json({ message: "Failed to fetch call details" });
    }
  }
}