import { IDashboardRepository,DashboardData } from "../../../interfaces/Admin/Dashboard/IDashboardRepo.js";
import { User } from "../../../models/User.js";

import { Room } from "../../../models/RoomModel.js";
import { AppError } from "../../../utils/AppError.js";

export class DashboardRepository implements IDashboardRepository{
  async getDashboardData(startDate?: Date, endDate?: Date): Promise<DashboardData> {
    try {
      console.log('startand ednd',startDate,endDate)
     const totalUsers = await User.countDocuments({isDeleted:false})  
     const premiumUsersResult = await User.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$plan" },
      // { $match: { "plan.status": "active" } },
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
      // { $match: { "plan.status": "active" } },
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

   
    const totalIncomeResult = await User.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$plan" },
      // { $match: { "plan.status": "active" } },
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

    const incomeOverTime = await User.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$plan" },
      // { $match: { "plan.status": "active" } },
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

    const totalRooms = await Room.countDocuments({ isDeleted: false });

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
    console.log('usercreation ',userCreationOverTime)

    const revenueDetails = await User.aggregate([
        { $match: { isDeleted: false } },
        { $unwind: "$plan" },
        // { $match: { "plan.status": "active" } },
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
          $project: {
            _id: 0,
            userName: "$name",
            email: "$email",
            planName: "$planDetails.name",
            amount: "$planDetails.discountAmount",
            purchaseDate: "$plan.startDate",
          },
        },
        { $sort: { purchaseDate: 1 } },
      ]);
      console.log('reveneu details',revenueDetails)

      const userDetails = await User.aggregate([
        { $match: { isDeleted: false } },
        ...(startDate && endDate
          ? [{ $match: { createdAt: { $gte: startDate, $lte: endDate } } }]
          : []),
        {
          $lookup: {
            from: "plans",
            localField: "plan.planId",
            foreignField: "_id",
            as: "planDetails",
          },
        },
        {
          $project: {
            _id: 0,
            userName: "$name",
            email: "$email",
            createdAt: "$createdAt",
            isPremium: {
              $cond: {
                if: {
                  $and: [
                    { $gt: [{ $size: "$planDetails" }, 0] },
                    { $eq: [{ $arrayElemAt: ["$planDetails.type", 0] }, "paid"] },
                    // { $eq: [{ $arrayElemAt: ["$plan.status", 0] }, "active"] },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        { $sort: { createdAt: 1 } },
      ]);
    return {totalUsers,
      premiumUsers,
      popularPlans,
      totalIncome,
      incomeOverTime,
      totalRooms,
      roomTypes,
      userCreationOverTime,
      revenueDetails,
      userDetails
    }
    } catch (error) {
      throw new AppError("Failed to fetch Dashboard details",500)
    }
  }
}