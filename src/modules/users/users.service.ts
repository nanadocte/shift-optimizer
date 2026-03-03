import {prisma} from '../../../lib/prisma'
import { Role } from '../../../generated/prisma/enums'


export async function getAllUsers (){
   return prisma.user.findMany({select: { id: true, email: true, name: true, role: true, job: true }})
}

export async function createUser (data : {email : string, name: string, job:string, password:string}){
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