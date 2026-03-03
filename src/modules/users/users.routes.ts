 import { FastifyInstance } from "fastify";

import * as userCtrl from './users.controller'

async function userRoutes (fastify : FastifyInstance, options:object) {
  fastify.get('/users', userCtrl.getUsers)
  fastify.post('/users', userCtrl.createUser)
  fastify.get('/users/:id', userCtrl.getUserById)
  fastify.put('/users/:id', userCtrl.updateUser)
  fastify.delete('/users/:id', userCtrl.deleteUser)
}


export default userRoutes;
