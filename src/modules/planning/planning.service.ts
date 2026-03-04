import { prisma } from "../../../lib/prisma";
import { Prisma } from '../../../generated/prisma/client'

// shift

export async function getAllShift(){
    return prisma.shift.findMany()

}
export async function createShift(data : Prisma.ShiftCreateInput){
     return prisma.shift.create({data})
}
export async function updateShift(data: Prisma.ShiftUpdateInput, where: Prisma.ShiftWhereUniqueInput){
    return prisma.shift.update({where, data})
}
export async function deleteShift(where:Prisma.ShiftWhereUniqueInput){
    return prisma.shift.delete({where})
}

// ShiftTemplater

export async function getAllShiftTemplate() {
return prisma.shiftTemplate.findMany()
}

export async function createShiftTemplate(data:Prisma.ShiftTemplateCreateInput){
return prisma.shiftTemplate.create({data})
}

export async function updateShiftTemplate(data: Prisma.ShiftTemplateUpdateInput ,where:Prisma.ShiftTemplateWhereUniqueInput){
    return prisma.shiftTemplate.update({data, where})
}

export async function deleteShiftTemplate(where:Prisma.ShiftTemplateWhereUniqueInput){
    return prisma.shiftTemplate.delete({where})
}