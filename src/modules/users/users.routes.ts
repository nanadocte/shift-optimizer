 import { FastifyInstance } from "fastify";
import {UserBody, UserParams} from './users.controller'
import * as userCtrl from './users.controller'

async function userRoutes (fastify : FastifyInstance, options:object) {
    //USER
    fastify.get('/users', {preHandler : fastify.authentificate}, userCtrl.getUsers)
    fastify.post<{Body:UserBody}>('/users', {preHandler : fastify.authentificate}, userCtrl.createUser)
    fastify.get<{Params:UserParams}>('/users/:id', {preHandler: fastify.authentificate}, userCtrl.getUserById)
    fastify.put<{Params:UserParams, Body:Partial<UserBody>}>('/users/:id', {preHandler : fastify.authentificate}, userCtrl.updateUser)
    fastify.delete<{Params:UserParams}>('/users/:id', {preHandler : fastify.authentificate}, userCtrl.deleteUser)

    //PREFERENCE
    fastify.get('/preferences', userCtrl.getPreference)
    fastify.get('/preferences/:id', userCtrl.getPreferenceById)
    fastify.post('/preferences', userCtrl.createPreference)
    fastify.put('/preferences/:id', userCtrl.updatePreference)
    fastify.delete('/preferences/:id', userCtrl.deletePreference)

    //CONTRAINTE
    fastify.get('/contraintes', userCtrl.getContrainte)
    fastify.get('/contraintes/:id', userCtrl.getContrainteById)
    fastify.post('/contraintes', userCtrl.createContrainte)
    fastify.put('/contraintes/:id', userCtrl.updateContrainte)
    fastify.delete('/contraintes/:id', userCtrl.deleteContrainte)
}


export default userRoutes;
