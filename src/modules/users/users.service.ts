import {prisma} from '../../../lib/prisma'
import { Role } from '../../../generated/prisma/enums'


export async function getAllUsers (){
   return prisma.user.findMany()
}

export async function createUser (data : {email : string, name: string, job:string}){
    return prisma.user.create({data : data})
}

export async function getUserById(where : {id : number}){
    return prisma.user.findUnique({where:where})
}

export async function updateUser(data : {email?:string, name?:string, role?:Role}, where : {id : number}){
    return prisma.user.update({where: where, data:data})
}

export async function deleteUser(where: {id : number}){
    return prisma.user.delete({where : where})
}