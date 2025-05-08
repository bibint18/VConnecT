"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectCallController = void 0;
class DirectCallController {
    constructor(directCallRepository) {
        this.directCallRepository = directCallRepository;
    }
    getCallDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached get call detailllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");
            try {
                const callId = req.query.callId;
                console.log("call id from directcall controller", callId);
                if (!callId) {
                    res.status(400).json({ message: "Call ID is required" });
                    return;
                }
                const call = yield this.directCallRepository.getCallById(callId);
                console.log("Callllll", call);
                if (!call) {
                    res.status(404).json({ message: "Call not found" });
                    return;
                }
                if (call.callerId.toString() !== req.user.id && call.receiverId.toString() !== req.user.id) {
                    res.status(403).json({ message: "Unauthorized to access this call" });
                    return;
                }
                res.json({
                    call: {
                        callerId: call.callerId.toString(),
                        receiverId: call.receiverId.toString(),
                        status: call.status,
                    },
                });
            }
            catch (error) {
                console.error("Error fetching call details:", error);
                res.status(500).json({ message: "Failed to fetch call details" });
            }
        });
    }
}
exports.DirectCallController = DirectCallController;
