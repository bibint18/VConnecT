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
exports.AdminUsersController = void 0;
const AdminUserRepository_1 = require("../repositories/AdminUserRepository");
const AdminUserService_1 = require("../services/AdminUserService");
const adminUsersService = new AdminUserService_1.AdminUserService(new AdminUserRepository_1.AdminUserRepository());
class AdminUsersController {
    constructor(adminUserService) {
        this.adminUserService = adminUserService;
    }
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 6, searchTerm = "", sortOption = "A-Z" } = req.query;
                console.log("users query", req.query);
                const users = yield adminUsersService.getAllUsers(Number(page), Number(limit), String(searchTerm), String(sortOption));
                console.log("users", users);
                const totalUsers = yield adminUsersService.getTotalUsers(String(searchTerm));
                console.log("ottal usrs", totalUsers);
                res.status(200).json({ users, totalUsers });
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("backend block user");
                const { id } = req.params;
                console.log(id);
                const user = yield adminUsersService.blockUser(id);
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    unblockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield adminUsersService.unblockUser(id);
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield adminUsersService.deleteUser(id);
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminUsersController = AdminUsersController;
exports.default = new AdminUsersController(new AdminUserService_1.AdminUserService(new AdminUserRepository_1.AdminUserRepository()));
