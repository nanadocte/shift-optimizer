import {prisma} from '../../../lib/prisma'
import { Prisma } from '../../../generated/prisma/client'

import { Role } from '../../../generated/prisma/enums'
export {PreferenceContrainteType} from '../../../generated/prisma/enums'



// USER
export async function getAllUsers (){
   return prisma.user.findMany({select: { id: true, email: true, name: true, role: true, job: true }})
}

export async function createUser (data : {email : string, name: string,  job:string, password:string}){
    return prisma.user.create({data : data, select: { id: true, email: true, name: true, role: true, job: true }})
        
}

export async function getUserById(where : {id : number}){
    return prisma.user.findUnique({where:where, select: { id: true, email: true, name: true, role: true, job: true } })
}

export async function updateUser(data : {email?:string, name?:string, role?:Role}, where : {id : number}){
    return prisma.user.update({where: where, data:data, select: { id: true, email: true, name: true, role: true, job: true }})
}

export async function deleteUser(where: {id : number}){
    return prisma.user.delete({where : where})
}


// CONTRAINTE

export async function getContrainte(){
    return prisma.contrainte.findMany()
}

export async function getContrainteById(where:Prisma.ContrainteWhereUniqueInput){
    return prisma.contrainte.findUnique({where})
}

export async function createContrainte(data: Prisma.ContrainteCreateInput){
    return prisma.contrainte.create({data})
}

export async function updateContrainte(data: Prisma.ContrainteUpdateInput, where : Prisma.ContrainteWhereUniqueInput){
    return prisma.contrainte.update({data, where})
}

export async function deleteContrainte (where:Prisma.ContrainteWhereUniqueInput){
    return prisma.contrainte.delete({where})
}

// PREFERENCE

export async function getPreference(){
    return prisma.preference.findMany()
}

export async function getPreferenceById(where: Prisma.PreferenceWhereUniqueInput){
return prisma.preference.findUnique({where})
}

export async function createPreference(data: Prisma.PreferenceCreateInput){
    return prisma.preference.create({data})
}

export async function updatePreference(data: Prisma.PreferenceUpdateInput, where : Prisma.PreferenceWhereUniqueInput){
    return prisma.preference.update({data, where})
}

export async function deletePreference (where:Prisma.PreferenceWhereUniqueInput){
    return prisma.preference.delete({where})
}