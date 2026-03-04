import { prisma } from "../lib/prisma";
import Fastify from "fastify";
import userRoutes from "./modules/users/users.routes"
import {authRoutes} from "./modules/auth/auth.routes"
import fjwt from '@fastify/jwt'
import { authentificate } from "./plugins/authentification";



const fastify = Fastify({logger:true})


fastify.get('/', async(request, reply) => {
    reply.send({hello : "coucouuuu"})
})


fastify.register(fjwt, { secret: process.env.JWT_SECRET! })
fastify.register(authentificate)
fastify.register(userRoutes)
fastify.register(authRoutes)

const start =  async() => {
  try{
  await prisma.$connect()
  console.log("Youhou Prisma est connecté")

}catch(err){
  console.error('La connexion a Prisma a échoué', err)
}
try{
    await fastify.listen({port:3000})
  }
  catch (err){
    fastify.log.error(err)
    process.exit(1)
  }
}




start()

