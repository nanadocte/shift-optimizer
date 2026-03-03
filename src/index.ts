import { prisma } from "../lib/prisma";
import Fastify from "fastify";
import userRoutes from "./modules/users/users.routes"

const fastify = Fastify({logger:true})


fastify.get('/', async(request, reply) => {
    reply.send({hello : "coucouuuu"})
})

fastify.register(userRoutes)

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

