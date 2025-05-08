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
exports.DashboardService = void 0;
const AppError_1 = require("../../../utils/AppError");
class DashboardService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    getDashboardData(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let start;
                let end;
                if (startDate && endDate) {
                    start = new Date(startDate);
                    end = new Date(endDate);
                    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                        throw new AppError_1.AppError("Invalid date format", 400);
                    }
                    if (start > end) {
                        throw new AppError_1.AppError("Start date must be before end date", 400);
                    }
                }
                return yield this.adminRepository.getDashboardData(start, end);
            }
            catch (error) {
                throw error instanceof AppError_1.AppError ? error : new AppError_1.AppError("Failed to fetch dashboard data", 500);
            }
        });
    }
}
exports.DashboardService = DashboardService;
