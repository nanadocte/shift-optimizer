import { prisma } from "../lib/prisma";
import Fastify from "fastify";

const fastify = Fastify({logger:true})

fastify.get('/', async(request, reply) => {
    reply.send({hello : "world"})
})

const start =  async() => {
  try{
    await fastify.listen({port:3000})
  }
  catch (err){
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

// async function main() {
//   const usersWithPosts = await prisma.user.findMany({
//     include: {
//       posts: true, 
//     }, 
//   }); 
//   console.dir(usersWithPosts, { depth: null }); 
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });