import { AdminUserRepository } from "../repositories/AdminUserRepository";
import { AdminUserService } from "../services/AdminUserService";
import {Response,Request} from 'express'
const adminUsersService = new AdminUserService(new AdminUserRepository())


export const getAllUsers = async(req:Request,res:Response) => {
  try {
    const {page=1,limit=6,searchTerm="",sortOption="A-Z"} = req.query
    console.log("users query",req.query)
    const users = await adminUsersService.getAllUsers(Number(page),Number(limit),String(searchTerm),String(sortOption))
    console.log("users",users)
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({error:"failed to fetch users"})
  }
}


export const blockUser = async(req:Request,res:Response) => {
  try {
    console.log("backend block user")
    const {id} = req.params
    console.log(id)
    const user = await adminUsersService.blockUser(id)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({error:"Failed to block User"})
  }
}

export const unblockUser = async(req:Request,res:Response) => {
  try {
    const {id} = req.params
    const user = await adminUsersService.unblockUser(id)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({error:"Failed to unblock User"})
  }
}

export const deleteUser = async(req:Request,res:Response) => {
  try {
    const {id} = req.params
    const user = await adminUsersService.deleteUser(id)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({error:"Failed to delete User"})
  }
}