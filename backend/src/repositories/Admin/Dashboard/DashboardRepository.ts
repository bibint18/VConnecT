import { IDashboardRepository,DashboardData } from "../../../interfaces/Admin/Dashboard/IDashboardRepo";
import { User,IUser } from "../../../models/User";
import { Plan } from "../../../models/PlansModel";

import { Room } from "../../../models/RoomModel";
import { AppError } from "../../../utils/AppError";

export class DashboardRepository implements IDashboardRepository{
  async getDashboardData(startDate?: Date, endDate?: Date): Promise<DashboardData> {
    try {
     const totalUsers = await User.countDocuments({isDeleted:false})  
     const premiumUsersResult = await User.aggregate([
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
    const premiumUsers = premiumUsersResult[0]?.premiumUsers || 0;
    const popularPlans = await User.aggregate([
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

    // Total Income
    const totalIncomeResult = await User.aggregate([
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
    const totalIncome = totalIncomeResult[0]?.totalIncome || 0;

    // Income Over Time
    const incomeOverTime = await User.aggregate([
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

    // Total Rooms
    const totalRooms = await Room.countDocuments({ isDeleted: false });

    // Public and Private Rooms
    const roomTypes = await Room.aggregate([
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

    // User Creation Over Time
    const userCreationOverTime = await User.aggregate([
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
    return {totalUsers,
      premiumUsers,
      popularPlans,
      totalIncome,
      incomeOverTime,
      totalRooms,
      roomTypes,
      userCreationOverTime,}
    } catch (error) {
      throw new AppError("Failed to fetch Dashboard details",500)
    }
  }
}