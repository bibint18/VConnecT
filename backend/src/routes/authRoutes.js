"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminUsersController_1 = __importDefault(require("../controllers/AdminUsersController"));
const AdminPlansController_1 = __importDefault(require("../controllers/AdminPlansController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const AdminRoomController_1 = __importDefault(require("../controllers/AdminRoomController"));
const AdminDailyTriviaController_1 = require("../controllers/AdminDailyTriviaController");
const AdminDailyTriviaRepository_1 = require("../repositories/AdminDailyTriviaRepository");
const AdminDailyTriviaService_1 = require("../services/AdminDailyTriviaService");
const RewardRepository_1 = require("../repositories/Admin/Reward/RewardRepository");
const UserRewardRepository_1 = require("../repositories/User/Reward/UserRewardRepository");
const RewardService_1 = require("../services/Admin/Reward/RewardService");
const RewardController_1 = require("../controllers/Admin/Reward/RewardController");
const DashboardRepository_1 = require("../repositories/Admin/Dashboard/DashboardRepository");
const DashboardService_1 = require("../services/Admin/Dashboard/DashboardService");
const DashboardController_1 = require("../controllers/Admin/Dashboard/DashboardController");
const router = express_1.default.Router();
//adminUser MAnagement
router.get('/admin/users', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminUsersController_1.default.getAllUsers.bind(AdminUsersController_1.default));
router.post('/admin/users/block/:id', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminUsersController_1.default.blockUser.bind(AdminUsersController_1.default));
router.post('/admin/users/unblock/:id', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminUsersController_1.default.unblockUser.bind(AdminUsersController_1.default));
router.post('/admin/users/delete/:id', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminUsersController_1.default.deleteUser.bind(AdminUsersController_1.default));
//admin plans management
router.post('/admin/plans/add', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminPlansController_1.default.createPlan.bind(AdminPlansController_1.default));
router.get('/admin/plans', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminPlansController_1.default.getAllPlans.bind(AdminPlansController_1.default));
router.get('/admin/plans/:id', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminPlansController_1.default.getPlanById.bind(AdminPlansController_1.default));
router.put('/admin/plans/edit/:id', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminPlansController_1.default.updatePlan.bind(AdminPlansController_1.default));
router.post('/admin/plans/delete/:id', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminPlansController_1.default.deletePlan.bind(AdminPlansController_1.default));
//admin room
router.get("/admin/rooms", authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminRoomController_1.default.getAllRooms.bind(AdminRoomController_1.default));
router.post("/admin/rooms/block/:id", authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminRoomController_1.default.blockRoom.bind(AdminRoomController_1.default));
router.post("/admin/rooms/unblock/:id", authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminRoomController_1.default.unblockRoom.bind(AdminRoomController_1.default));
router.post("/admin/rooms/delete/:id", authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminRoomController_1.default.deleteRoom.bind(AdminRoomController_1.default));
router.get('/admin/room/details/:id', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, AdminRoomController_1.default.getRoomDetails.bind(AdminRoomController_1.default));
//daily trivia 
const dailyTriviaRepository = new AdminDailyTriviaRepository_1.AdminDailyTriviaReposiroy();
const dailyTriviaService = new AdminDailyTriviaService_1.AdminDailyTriviaService(dailyTriviaRepository);
const dailyTriviaController = new AdminDailyTriviaController_1.AdminDailyTriviaController(dailyTriviaService);
router.post('/admin/trivia', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, dailyTriviaController.addTriviaQuestion.bind(dailyTriviaController));
router.get('/admin/trivia', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, dailyTriviaController.getTriviaQuestions.bind(dailyTriviaController));
router.put('/admin/trivia/update/:id', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, dailyTriviaController.updateTriviaQuestion.bind(dailyTriviaController));
router.delete('/admin/trivia/delete/:id', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, dailyTriviaController.deleteTriviaQuestion.bind(dailyTriviaController));
router.get("/admin/trivia/:id", authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, dailyTriviaController.getTriviaQuestionById.bind(dailyTriviaController));
//reward
const adminRewardRepository = new RewardRepository_1.RewardRepository();
const userRewardRepository = new UserRewardRepository_1.UserRewardRepository();
// const userRewardService = new UserReward     user service needed to be written 
const adminRewardService = new RewardService_1.AdminRewardService(adminRewardRepository);
const adminRewardController = new RewardController_1.AdminRewardController(adminRewardService);
router.post('/admin/rewards', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, adminRewardController.createReward.bind(adminRewardController));
router.put('/admin/rewards/:rewardId', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, adminRewardController.updateReward.bind(adminRewardController));
router.delete('/admin/rewards/:rewardId', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, adminRewardController.deleteReward.bind(adminRewardController));
router.get('/admin/rewards', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, adminRewardController.getRewards.bind(adminRewardController));
router.get('/admin/reward', authMiddleware_1.authenticateToken, authMiddleware_1.restrictToAdmin, adminRewardController.getRewardById.bind(adminRewardController));
//dashboard
const dashboardRepository = new DashboardRepository_1.DashboardRepository();
const dashboardService = new DashboardService_1.DashboardService(dashboardRepository);
const dashboardController = new DashboardController_1.DashboardController(dashboardService);
router.get('/dashboard', dashboardController.getDashboardData.bind(dashboardController));
exports.default = router;
