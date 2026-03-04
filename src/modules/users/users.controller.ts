import * as userService from './users.service'
import { FastifyRequest, FastifyReply } from "fastify"

export type UserBody = { email: string, name: string, job: string, password:string }
export type UserParams = { id: string }
type CreateUserRequest = FastifyRequest<{ Body: UserBody }>
export type UpdateUserRequest = FastifyRequest<{ Params: UserParams, Body: Partial<UserBody> }>
type UserParamsRequest = FastifyRequest<{ Params: UserParams }>

async function checkPermission (request : FastifyRequest, targetId : number){
  const currentUser = await userService.getUserById({id : request.user.userId})
  const isAdmin = currentUser?.role === "ADMIN" 
  const isSameUser = currentUser?.id === Number(targetId)
  return {currentUser, isAdmin, isSameUser}
}

export async function getUsers(request: FastifyRequest, reply: FastifyReply){
   const users = await userService.getAllUsers()
   return users
}

export async function createUser(request: CreateUserRequest, 
  reply: FastifyReply){
    const {isAdmin} = await checkPermission(request, request.user.userId)
    if (!isAdmin) return reply.status(403).send({message : "Vous n'êtes pas autorisé"})
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
    const {isAdmin, isSameUser} = await checkPermission(request, Number(request.params.id))
    if (isAdmin || isSameUser) {
      const user = await userService.updateUser(request.body, {id : Number(request.params.id)})
      return user}
    else return reply.status(403).send({message : "Utilisateur non autorisé"})
}

export async function deleteUser(request: UserParamsRequest, 
  reply: FastifyReply){
    const {isAdmin, isSameUser} = await checkPermission(request, Number(request.params.id))
    if (isAdmin || isSameUser ) {
    const user = await userService.deleteUser({id:Number(request.params.id)})
    return user
    }
    else return reply.status(403).send({message : "Utilisateur non autorisé"})
}