 import { FastifyInstance } from "fastify";
import {UserBody, UserParams} from './users.controller'
import * as userCtrl from './users.controller'

async function userRoutes (fastify : FastifyInstance, options:object) {
  fastify.get('/users', {preHandler : fastify.authentificate}, userCtrl.getUsers)
  fastify.post<{Body:UserBody}>('/users', {preHandler : fastify.authentificate}, userCtrl.createUser)
  fastify.get<{Params:UserParams}>('/users/:id', {preHandler: fastify.authentificate}, userCtrl.getUserById)
  fastify.put<{Params:UserParams, Body:Partial<UserBody>}>('/users/:id', {preHandler : fastify.authentificate}, userCtrl.updateUser)
  fastify.delete<{Params:UserParams}>('/users/:id', {preHandler : fastify.authentificate}, userCtrl.deleteUser)
}


export default userRoutes;
