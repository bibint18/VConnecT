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
exports.DashboardRepository = void 0;
const User_1 = require("../../../models/User");
const RoomModel_1 = require("../../../models/RoomModel");
const AppError_1 = require("../../../utils/AppError");
class DashboardRepository {
    getDashboardData(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const totalUsers = yield User_1.User.countDocuments({ isDeleted: false });
                const premiumUsersResult = yield User_1.User.aggregate([
                    { $match: { isDeleted: false } },
                    { $unwind: "$plan" },
                    { $match: { "plan.status": "active" } },
                    ...(startDate && endDate
                        ? [{ $match: { "plan.startDate": { $gte: startDate, $lte: endDate } } }]
                        : []),
                    {
                        $lookup: {
                            from: "plans",
                            localField: "plan.planId",
                            foreignField: "_id",
                            as: "planDetails",
                        },
                    },
                    { $unwind: "$planDetails" },
                    { $match: { "planDetails.type": "paid" } },
                    { $group: { _id: "$_id" } },
                    { $count: "premiumUsers" },
                ]);
                const premiumUsers = ((_a = premiumUsersResult[0]) === null || _a === void 0 ? void 0 : _a.premiumUsers) || 0;
                const popularPlans = yield User_1.User.aggregate([
                    { $match: { isDeleted: false } },
                    { $unwind: "$plan" },
                    { $match: { "plan.status": "active" } },
                    ...(startDate && endDate
                        ? [{ $match: { "plan.startDate": { $gte: startDate, $lte: endDate } } }]
                        : []),
                    {
                        $lookup: {
                            from: "plans",
                            localField: "plan.planId",
                            foreignField: "_id",
                            as: "planDetails",
                        },
                    },
                    { $unwind: "$planDetails" },
                    { $match: { "planDetails.type": "paid" } },
                    {
                        $group: {
                            _id: "$plan.planId",
                            planName: { $first: "$planDetails.name" },
                            count: { $sum: 1 },
                            discountAmount: { $first: "$planDetails.discountAmount" },
                        },
                    },
                    { $sort: { count: -1 } },
                    { $project: { _id: 0, planName: 1, count: 1, discountAmount: 1 } },
                ]);
                const totalIncomeResult = yield User_1.User.aggregate([
                    { $match: { isDeleted: false } },
                    { $unwind: "$plan" },
                    { $match: { "plan.status": "active" } },
                    ...(startDate && endDate
                        ? [{ $match: { "plan.startDate": { $gte: startDate, $lte: endDate } } }]
                        : []),
                    {
                        $lookup: {
                            from: "plans",
                            localField: "plan.planId",
                            foreignField: "_id",
                            as: "planDetails",
                        },
                    },
                    { $unwind: "$planDetails" },
                    { $match: { "planDetails.type": "paid" } },
                    {
                        $group: {
                            _id: null,
                            totalIncome: { $sum: "$planDetails.discountAmount" },
                        },
                    },
                    { $project: { _id: 0, totalIncome: 1 } },
                ]);
                const totalIncome = ((_b = totalIncomeResult[0]) === null || _b === void 0 ? void 0 : _b.totalIncome) || 0;
                const incomeOverTime = yield User_1.User.aggregate([
                    { $match: { isDeleted: false } },
                    { $unwind: "$plan" },
                    { $match: { "plan.status": "active" } },
                    ...(startDate && endDate
                        ? [{ $match: { "plan.startDate": { $gte: startDate, $lte: endDate } } }]
                        : []),
                    {
                        $lookup: {
                            from: "plans",
                            localField: "plan.planId",
                            foreignField: "_id",
                            as: "planDetails",
                        },
                    },
                    { $unwind: "$planDetails" },
                    { $match: { "planDetails.type": "paid" } },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$plan.startDate" },
                                month: { $month: "$plan.startDate" },
                            },
                            total: { $sum: "$planDetails.discountAmount" },
                        },
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } },
                    {
                        $project: {
                            _id: 0,
                            year: "$_id.year",
                            month: "$_id.month",
                            total: 1,
                        },
                    },
                ]);
                const totalRooms = yield RoomModel_1.Room.countDocuments({ isDeleted: false });
                const roomTypes = yield RoomModel_1.Room.aggregate([
                    { $match: { isDeleted: false } },
                    {
                        $group: {
                            _id: "$type",
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            type: "$_id",
                            count: 1,
                        },
                    },
                ]);
                const userCreationOverTime = yield User_1.User.aggregate([
                    { $match: { isDeleted: false } },
                    ...(startDate && endDate
                        ? [{ $match: { createdAt: { $gte: startDate, $lte: endDate } } }]
                        : []),
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" },
                            },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } },
                    {
                        $project: {
                            _id: 0,
                            year: "$_id.year",
                            month: "$_id.month",
                            count: 1,
                        },
                    },
                ]);
                return { totalUsers,
                    premiumUsers,
                    popularPlans,
                    totalIncome,
                    incomeOverTime,
                    totalRooms,
                    roomTypes,
                    userCreationOverTime, };
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to fetch Dashboard details", 500);
            }
        });
    }
}
exports.DashboardRepository = DashboardRepository;
