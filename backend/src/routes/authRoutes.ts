import express from 'express'
import AdminUsersController from '../controllers/AdminUsersController'
import AdminPlansController from '../controllers/AdminPlansController'
import { authenticateToken,restrictToAdmin} from '../middlewares/authMiddleware'
import AdminRoomController from '../controllers/AdminRoomController'
import { auth } from 'google-auth-library'
import { AdminDailyTriviaController } from '../controllers/AdminDailyTriviaController'
import { AdminDailyTriviaReposiroy } from '../repositories/AdminDailyTriviaRepository'
import { AdminDailyTriviaService } from '../services/AdminDailyTriviaService'
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

export default router