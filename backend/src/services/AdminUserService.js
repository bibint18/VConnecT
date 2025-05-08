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
exports.AdminUserService = void 0;
class AdminUserService {
    constructor(AdminUserRepository) {
        this.AdminUserRepository = AdminUserRepository;
    }
    getAllUsers(page, limit, searchTerm, sortOption) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdminUserRepository.getAllUsers(page, limit, searchTerm, sortOption);
        });
    }
    getTotalUsers(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdminUserRepository.getTotalUsers(search);
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdminUserRepository.blockUser(id);
        });
    }
    unblockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdminUserRepository.unblockUser(id);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AdminUserRepository.deleteUser(id);
        });
    }
}
exports.AdminUserService = AdminUserService;
