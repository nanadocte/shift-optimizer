import * as shiftCtrl from './planning.controller'
 import { FastifyInstance } from "fastify";


export async function shiftRoutes(fastify:FastifyInstance, option:object){
    fastify.get('/shifts', shiftCtrl.getAllShift)
    fastify.post('/shifts', shiftCtrl.createShift)
    fastify.put('/shifts/:id', shiftCtrl.updateShift)
    fastify.delete('/shifts/:id', shiftCtrl.deleteShift)

    fastify.get('/shiftsTemplate', shiftCtrl.getAllShiftTemplates)
    fastify.post('/shiftsTemplate', shiftCtrl.createShiftTemplate)
    fastify.put('/shiftsTemplate/:id', shiftCtrl.updateShiftTemplate)
    fastify.delete('/shiftsTemplate/:id', shiftCtrl.deleteShiftTemplate)
}