import * as authCtrl from './auth.controller'
import { FastifyInstance } from 'fastify'


export async function authRoutes (fastify:FastifyInstance, options:object){
    fastify.post('/auth/signup', authCtrl.signUp)
    fastify.post('/auth/login', authCtrl.login)
}
