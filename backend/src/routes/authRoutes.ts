import express from 'express'
import AdminUsersController from '../controllers/AdminUsersController'
import AdminPlansController from '../controllers/AdminPlansController'
import { authenticateToken,restrictToAdmin} from '../middlewares/authMiddleware'
import AdminRoomController from '../controllers/AdminRoomController'
import { auth } from 'google-auth-library'
import { AdminDailyTriviaController } from '../controllers/AdminDailyTriviaController'
import { AdminDailyTriviaReposiroy } from '../repositories/AdminDailyTriviaRepository'
import { AdminDailyTriviaService } from '../services/AdminDailyTriviaService'
import { RewardRepository } from '../repositories/Admin/Reward/RewardRepository'
import { UserRewardRepository } from '../repositories/User/Reward/UserRewardRepository'
import { AdminRewardService } from '../services/Admin/Reward/RewardService'
import { AdminRewardController } from '../controllers/Admin/Reward/RewardController'
import { DashboardRepository } from '../repositories/Admin/Dashboard/DashboardRepository'
import { DashboardService } from '../services/Admin/Dashboard/DashboardService'
import { DashboardController } from '../controllers/Admin/Dashboard/DashboardController'
const router = express.Router()


//adminUser MAnagement
router.get('/admin/users',authenticateToken,restrictToAdmin,AdminUsersController.getAllUsers.bind(AdminUsersController) )
router.post('/admin/users/block/:id',authenticateToken,restrictToAdmin,AdminUsersController.blockUser.bind(AdminUsersController))
router.post('/admin/users/unblock/:id',authenticateToken,restrictToAdmin,AdminUsersController.unblockUser.bind(AdminUsersController))
router.post('/admin/users/delete/:id',authenticateToken,restrictToAdmin,AdminUsersController.deleteUser.bind(AdminUsersController))

//admin plans management
router.post('/admin/plans/add',authenticateToken,restrictToAdmin,AdminPlansController.createPlan.bind(AdminPlansController))
router.get('/admin/plans',authenticateToken,restrictToAdmin,AdminPlansController.getAllPlans.bind(AdminPlansController))
router.get('/admin/plans/:id',authenticateToken,restrictToAdmin,AdminPlansController.getPlanById.bind(AdminPlansController))
router.put('/admin/plans/edit/:id',authenticateToken,restrictToAdmin,AdminPlansController.updatePlan.bind(AdminPlansController))
router.post('/admin/plans/delete/:id',authenticateToken,restrictToAdmin,AdminPlansController.deletePlan.bind(AdminPlansController))


//admin room
router.get("/admin/rooms", authenticateToken,restrictToAdmin, AdminRoomController.getAllRooms.bind(AdminRoomController));
router.post("/admin/rooms/block/:id", authenticateToken,restrictToAdmin,AdminRoomController.blockRoom.bind(AdminRoomController));
router.post("/admin/rooms/unblock/:id", authenticateToken,restrictToAdmin,AdminRoomController.unblockRoom.bind(AdminRoomController));
router.post("/admin/rooms/delete/:id", authenticateToken,restrictToAdmin,AdminRoomController.deleteRoom.bind(AdminRoomController));
router.get('/admin/room/details/:id',authenticateToken,restrictToAdmin,AdminRoomController.getRoomDetails.bind(AdminRoomController))


//daily trivia 
const dailyTriviaRepository = new AdminDailyTriviaReposiroy()
const dailyTriviaService = new AdminDailyTriviaService(dailyTriviaRepository)
const dailyTriviaController = new AdminDailyTriviaController(dailyTriviaService)
router.post('/admin/trivia',authenticateToken,restrictToAdmin,dailyTriviaController.addTriviaQuestion.bind(dailyTriviaController))
router.get('/admin/trivia',authenticateToken,restrictToAdmin,dailyTriviaController.getTriviaQuestions.bind(dailyTriviaController))
router.put('/admin/trivia/update/:id',authenticateToken,restrictToAdmin,dailyTriviaController.updateTriviaQuestion.bind(dailyTriviaController))
router.delete('/admin/trivia/delete/:id',authenticateToken,restrictToAdmin,dailyTriviaController.deleteTriviaQuestion.bind(dailyTriviaController))
router.get("/admin/trivia/:id", authenticateToken, restrictToAdmin, dailyTriviaController.getTriviaQuestionById.bind(dailyTriviaController));

//reward

const adminRewardRepository = new RewardRepository()
const userRewardRepository = new UserRewardRepository()
// const userRewardService = new UserReward     user service needed to be written 
const adminRewardService = new AdminRewardService(adminRewardRepository)
const adminRewardController = new AdminRewardController(adminRewardService)

router.post('/admin/rewards',authenticateToken,restrictToAdmin,adminRewardController.createReward.bind(adminRewardController))
router.put('/admin/rewards/:rewardId',authenticateToken,restrictToAdmin,adminRewardController.updateReward.bind(adminRewardController))
router.delete('/admin/rewards/:rewardId',authenticateToken,restrictToAdmin,adminRewardController.deleteReward.bind(adminRewardController))
router.get('/admin/rewards',authenticateToken,restrictToAdmin,adminRewardController.getRewards.bind(adminRewardController))
router.get('/admin/reward',authenticateToken,restrictToAdmin,adminRewardController.getRewardById.bind(adminRewardController))


//dashboard
const dashboardRepository = new DashboardRepository()
const dashboardService = new DashboardService(dashboardRepository)
const dashboardController = new DashboardController(dashboardService)
router.get('/dashboard',dashboardController.getDashboardData.bind(dashboardController))

export default router