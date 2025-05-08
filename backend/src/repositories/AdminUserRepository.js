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
exports.AdminUserRepository = void 0;
const User_1 = require("../models/User");
class AdminUserRepository {
    getAllUsers(page, limit, searchTerm, sortOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { isAdmin: false, isDeleted: false };
            if (searchTerm) {
                query.name = { $regex: searchTerm, $options: "i" };
            }
            let sortQuery = {};
            if (sortOption === "A-Z") {
                sortQuery = { name: 1 };
            }
            else if (sortOption === 'Z-A') {
                sortQuery = { name: -1 };
            }
            else if (sortOption === 'recent') {
                sortQuery = { createdAt: -1 };
            }
            return yield User_1.User.find(query)
                .populate('plan.planId', 'name')
                .sort(sortQuery)
                .skip((page - 1) * limit)
                .limit(limit);
        });
    }
    getTotalUsers(search) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = { isDeleted: false, isAdmin: false };
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }
            return yield User_1.User.countDocuments(query);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findById(id);
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        });
    }
    unblockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        });
    }
}
exports.AdminUserRepository = AdminUserRepository;
