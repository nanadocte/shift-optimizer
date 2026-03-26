import { prisma } from "../lib/prisma";
import Fastify from "fastify";
import userRoutes from "./modules/users/users.routes"
import {authRoutes} from "./modules/auth/auth.routes"
import { shiftRoutes } from "./modules/planning/planning.routes";
import fjwt from '@fastify/jwt'
import { authentificate } from "./plugins/authentification";
import cors from '@fastify/cors'




const fastify = Fastify({logger:true})

await fastify.register(cors, {
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"]
})


fastify.get('/', async(request, reply) => {
    reply.send({hello : "coucouuuu"})
})


fastify.register(fjwt, { secret: process.env.JWT_SECRET! })
fastify.register(authentificate)
fastify.register(userRoutes)
fastify.register(authRoutes)
fastify.register(shiftRoutes)

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

