import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

declare module 'fastify'{
    interface FastifyInstance{
        authentificate:(request : FastifyRequest, reply : FastifyReply)=> Promise<void>
    }
}

export const authentificate = fastifyPlugin(async(fastify:FastifyInstance)=>  {
    fastify.decorate('authentificate', async (request: FastifyRequest, reply:FastifyReply)=> {
        try{
            await request.jwtVerify()
        }catch(err){
            reply.status(401).send({message : "Non autorisé"})
        }
    })
    
})