import * as authService from './auth.service'
import { FastifyRequest, FastifyReply } from "fastify"

type UserBody = { email: string, name: string, password: string }
type loginRequest = FastifyRequest<{ Body: UserBody }>
type signUpRequest = FastifyRequest<{ Body: UserBody }>


export async function signUp(request : signUpRequest, reply: FastifyReply){
    const users = await authService.signUp(request.body)
    return users
}

export async function login(request : loginRequest, reply:FastifyReply){
    const users = await authService.login(request.body)
    if (!users) return reply.status(401).send({message : 'Email ou mot de passe incorrect' }) 
        const token = await reply.jwtSign({userId:users.id})
    return {token}
}