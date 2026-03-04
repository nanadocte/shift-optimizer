import * as userService from './users.service'
import { FastifyRequest, FastifyReply } from "fastify"

export type UserBody = { email: string, name: string, job: string, password:string }
export type UserParams = { id: string }
type CreateUserRequest = FastifyRequest<{ Body: UserBody }>
export type UpdateUserRequest = FastifyRequest<{ Params: UserParams, Body: Partial<UserBody> }>
type UserParamsRequest = FastifyRequest<{ Params: UserParams }>

export async function getUsers(request: FastifyRequest, reply: FastifyReply){
   const users = await userService.getAllUsers()
   return users
}

export async function createUser(request: CreateUserRequest, 
  reply: FastifyReply){
const user = await userService.createUser(request.body)
return user
}

export async function getUserById(request: UserParamsRequest, 
  reply: FastifyReply){
const user = await userService.getUserById({id:Number(request.params.id)})
return user
}


export async function updateUser(request: UpdateUserRequest, 
  reply: FastifyReply){
    const user = await userService.updateUser(request.body, {id : Number(request.params.id)})
return user
}

export async function deleteUser(request: UserParamsRequest, 
  reply: FastifyReply){
const user = await userService.deleteUser({id:Number(request.params.id)})
return user
}