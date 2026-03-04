import * as planningService from './planning.service'
import { FastifyRequest, FastifyReply } from 'fastify'
import { Prisma } from '../../../generated/prisma/client'

type ShiftTemplateBody = Prisma.ShiftTemplateCreateInput
type ShiftBody = Prisma.ShiftCreateInput
type ShiftParams = {id: string}

type CreateShiftTemplateRequest = FastifyRequest<{Body : ShiftTemplateBody}>
type UpdateShifttemplateRequest = FastifyRequest<{Body : ShiftTemplateBody, Params : ShiftParams}>
type DeleteShifttemplateRequest = FastifyRequest<{Params: ShiftParams}>

type CreateShiftRequest = FastifyRequest<{Body:ShiftBody}>
type UpdateShiftRequest = FastifyRequest<{Body : ShiftBody, Params : ShiftParams}>

// shiftTemplate

export async function getAllShiftTemplates(request :FastifyRequest, reply:FastifyReply ){
    const shiftTemplate = await planningService.getAllShiftTemplate()
    return shiftTemplate
}

export async function createShiftTemplate(request : CreateShiftTemplateRequest, reply:FastifyReply){
const shiftTemplate = await planningService.createShiftTemplate(request.body)
return shiftTemplate
}

export async function updateShiftTemplate(request : UpdateShifttemplateRequest, reply:FastifyReply){
    const shiftTemplate = await planningService.updateShiftTemplate(request.body, {id:Number(request.params.id)})
    return shiftTemplate
}
export async function deleteShiftTemplate(request :DeleteShifttemplateRequest, reply: FastifyReply ){
    const shiftTemplate = await planningService.deleteShiftTemplate({id:Number(request.params.id)})
    return shiftTemplate
}

// Shift

export async function getAllShift(request :FastifyRequest, reply:FastifyReply ){
    const shift = await planningService.getAllShift()
    return shift
}

export async function createShift(request : CreateShiftRequest, reply:FastifyReply){
const shift = await planningService.createShift(request.body)
return shift
}

export async function updateShift(request : UpdateShiftRequest, reply:FastifyReply){
    const shift = await planningService.updateShift(request.body, {id:Number(request.params.id)})
    return shift
}
export async function deleteShift(request :DeleteShifttemplateRequest, reply: FastifyReply ){
    const shift = await planningService.deleteShift({id:Number(request.params.id)})
    return shift
}