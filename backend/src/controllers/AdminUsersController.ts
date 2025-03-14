import { AdminUserRepository } from "../repositories/AdminUserRepository";
import { AdminUserService } from "../services/AdminUserService";
import {Response,Request, NextFunction} from 'express'
const adminUsersService = new AdminUserService(new AdminUserRepository())


export const getAllUsers = async(req:Request,res:Response,next:NextFunction) => {
  try {
    const {page=1,limit=6,searchTerm="",sortOption="A-Z"} = req.query
    console.log("users query",req.query)
    const users = await adminUsersService.getAllUsers(Number(page),Number(limit),String(searchTerm),String(sortOption))
    console.log("users",users)
    const totalUsers = await adminUsersService.getTotalUsers(String(searchTerm))
    console.log("ottal usrs",totalUsers)
    res.status(200).json({users,totalUsers})
  } catch (error) {
    next(error)
  }
}


export const blockUser = async(req:Request,res:Response,next:NextFunction) => {
  try {
    console.log("backend block user")
    const {id} = req.params
    console.log(id)
    const user = await adminUsersService.blockUser(id)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const unblockUser = async(req:Request,res:Response,next:NextFunction) => {
  try {
    const {id} = req.params
    const user = await adminUsersService.unblockUser(id)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async(req:Request,res:Response,next:NextFunction) => {
  try {
    const {id} = req.params
    const user = await adminUsersService.deleteUser(id)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}