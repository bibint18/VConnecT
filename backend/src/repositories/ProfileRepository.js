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
exports.ProfileRepository = void 0;
const User_1 = require("../models/User");
class ProfileRepository {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield User_1.User.findById(id).exec();
            }
            catch (error) {
                console.error('error finding user by id', error);
                throw error;
            }
        });
    }
    updateProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached profile update repository", id, data);
                const updatedUser = yield User_1.User.findByIdAndUpdate(id, data, { new: true }).exec();
                console.log("updated user from repo ", updatedUser);
                return updatedUser;
            }
            catch (error) {
                console.error("error updating user", error);
                throw error;
            }
        });
    }
    // async updateStreak(id: string): Promise<IUser | null> {
    //   try {
    //     const user = await User.findById(id).exec()
    //     console.log("ser from repo")
    //     if(!user) return null
    //     const now = new Date()
    //     const lastUpdate = user.lastStreakUpdate
    //     console.log("last update",lastUpdate)
    //     console.log("diff ",(now.getTime() - lastUpdate.getTime() ) > 24 * 60 * 60 * 1000)
    //     if(!lastUpdate || (now.getTime() - lastUpdate.getTime() > 24 * 60 * 60 * 1000)){
    //       user.streak=1
    //     }else{
    //       user.streak +=1
    //     }
    //     user.lastStreakUpdate = now
    //     const updatedUser = await user.save()
    //     return updatedUser
    //   } catch (error) {
    //     console.log("errror",error)
    //     throw  error
    //   }
    // }
    updateStreak(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findById(id).exec();
                if (!user)
                    return null;
                const now = new Date();
                const lastUpdate = user.lastStreakUpdate;
                // Debugging logs
                console.log("Current time:", now.toISOString());
                console.log("Last streak update:", lastUpdate ? lastUpdate.toISOString() : "null");
                // Calculate time difference in milliseconds
                const timeDiff = lastUpdate ? now.getTime() - lastUpdate.getTime() : Infinity;
                console.log("Time difference (ms):", timeDiff);
                console.log("Time difference (hours):", timeDiff / (1000 * 60 * 60));
                // Check if more than 24 hours have passed (24 * 60 * 60 * 1000 = 86,400,000 ms)
                const twentyFourHours = 24 * 60 * 60 * 1000;
                if (lastUpdate && timeDiff < twentyFourHours) {
                    console.log("Check-in already done within 24 hours - no update");
                    return user; // Return unchanged user
                }
                if (!lastUpdate || timeDiff > twentyFourHours) {
                    console.log("Resetting streak to 1 - no previous update or > 24 hours");
                    user.streak = 1;
                }
                else {
                    console.log("Incrementing streak - within 24 hours");
                    user.streak += 1;
                }
                user.lastStreakUpdate = now;
                const updatedUser = yield user.save();
                console.log("Updated streak for user:", updatedUser.streak, "Last update:", updatedUser.lastStreakUpdate.toISOString());
                return updatedUser;
            }
            catch (error) {
                console.error("error updating streak", error);
                throw error;
            }
        });
    }
}
exports.ProfileRepository = ProfileRepository;
