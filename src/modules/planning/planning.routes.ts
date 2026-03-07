import * as shiftCtrl from './planning.controller'
 import { FastifyInstance } from "fastify";


export async function shiftRoutes(fastify:FastifyInstance, option:object){
    fastify.get('/shifts', shiftCtrl.getAllShift)
    fastify.post('/shifts', shiftCtrl.createShift)
    fastify.put('/shifts/:id', shiftCtrl.updateShift)
    fastify.delete('/shifts/:id', shiftCtrl.deleteShift)

    fastify.get('/shiftstemplates', shiftCtrl.getAllShiftTemplates)
    fastify.post('/shiftstemplates', shiftCtrl.createShiftTemplate)
    fastify.put('/shiftstemplates/:id', shiftCtrl.updateShiftTemplate)
    fastify.delete('/shiftstemplates/:id', shiftCtrl.deleteShiftTemplate)
    fastify.post('/planning/generate', shiftCtrl.generatePlanning)
fastify.post('/planning/save', { preHandler: fastify.authentificate }, shiftCtrl.savePlanning as any)
}