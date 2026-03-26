import bcrypt from 'bcrypt'
import {prisma} from '../../../lib/prisma'


export async function signUp (data: {email : string, name:string, password:string}){
try{
    const hash = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({data : {email : data.email, name: data.name, password : hash}, 
                                            select: { id: true, email: true, name: true, role: true }})
    return user
}catch(err){
console.error(err)
}
}



export async function login(data :{email:string, password:string}){
    try{
        const users = await prisma.user.findUnique({where:{email: data.email}})
        if(!users) return null 
        if (!users || !users.password) return null
        const valid = await bcrypt.compare(data.password, users.password)
        if(!valid) return null
        return users
    }catch (err){
        console.error(err)

    }

}