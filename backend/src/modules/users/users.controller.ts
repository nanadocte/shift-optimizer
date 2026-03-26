import * as userService from './users.service'
import { FastifyRequest, FastifyReply } from "fastify"
import { Prisma } from '../../../generated/prisma/client'


//User
export type UserBody = { email: string, name: string, job: string, password:string }
export type UserParams = { id: string }

type CreateUserRequest = FastifyRequest<{ Body: UserBody }>
export type UpdateUserRequest = FastifyRequest<{ Params: UserParams, Body: Partial<UserBody> }>
type UserParamsRequest = FastifyRequest<{ Params: UserParams }>

// Contrainte
type ContrainteBody = Prisma.ContrainteCreateInput
type DeleteContrainteRequest = FastifyRequest<{ Params: UserParams }>
type UpdateContrainteRequest = FastifyRequest<{ Params: UserParams, Body: Partial<ContrainteBody> }>
type CreateContrainteRequest = FastifyRequest<{ Body: ContrainteBody }>


// Preference 
type PreferenceBody = Prisma.PreferenceCreateInput

type DeletePreferenceRequest = FastifyRequest<{ Params: UserParams }>
type UpdatePreferenceRequest = FastifyRequest<{ Params: UserParams, Body: Partial<PreferenceBody> }>
type CreatePreferenceRequest = FastifyRequest<{ Body: PreferenceBody }>


// User function

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

// Preference function

export async function getPreference(request:FastifyRequest, reply:FastifyReply){
  const preference = await userService.getPreference()
  return preference
}

export async function getPreferenceById(request: UserParamsRequest, reply:FastifyReply){
  const preference = await userService.getPreferenceById({id:Number(request.params.id)})
  return preference
}

export async function createPreference(request: CreatePreferenceRequest, reply:FastifyReply){
  const preference = await userService.createPreference(request.body)
  return preference 
}

export async function updatePreference(request : UpdatePreferenceRequest, reply:FastifyReply){
  const preference = await userService.updatePreference(request.body, {id:Number(request.params.id)})
  return preference
}

export async function deletePreference (request : DeletePreferenceRequest, reply:FastifyReply){
  const preference = await userService.deletePreference({id : Number(request.params.id)})
  return preference
}

// Contrainte Function 

export async function getContrainte(request:FastifyRequest, reply:FastifyReply){
  const contrainte = await userService.getContrainte()
  return contrainte 

}

export async function getContrainteById(request : UserParamsRequest, reply: FastifyReply ){
  const contrainte = await userService.getContrainteById({id:Number(request.params.id)})
  return contrainte 

}

export async function createContrainte(request: CreateContrainteRequest, reply:FastifyReply){
  const contrainte = await userService.createContrainte(request.body)
  return contrainte 
}

export async function updateContrainte(request : UpdateContrainteRequest, reply:FastifyReply){
  const contrainte = await userService.updateContrainte(request.body, {id:Number(request.params.id)})
  return contrainte
}

export async function deleteContrainte (request : DeleteContrainteRequest, reply:FastifyReply){
  const contrainte = await userService.deleteContrainte({id : Number(request.params.id)})
  return contrainte
}