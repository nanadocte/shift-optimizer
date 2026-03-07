import { prisma } from "../../../lib/prisma";
import { Prisma } from '../../../generated/prisma/client'
import * as UserService from "../users/users.service"
import { DayOfWeek } from "../../../generated/prisma/client";
import { Contrainte, ShiftTemplate, User } from "../../../generated/prisma/browser";

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

// ShiftTemplate

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

// Generate Planning

export async function generatePlanning(weekStart : Date, allowOverTime : boolean=false){
    const shiftTemplate = await getAllShiftTemplate()
    const contraintes   = await UserService.getContrainte()
    const preferences   = await UserService.getPreference()
    const users         = await UserService.getAllUsers()
    const planning = []
    
    for(const template of shiftTemplate){

    if (!skipWrongTemplate(template, weekStart)) continue 

     const shiftDate = template.type === "PONCTUAL" 
        ? template.date
        : getDateForDay(weekStart, template.day!)
        if (!shiftDate) continue 
        
    const userDispo = await checkShiftDispo(shiftDate, users, contraintes, template)
    const usersAssigned = await filterHours(shiftDate ,allowOverTime, template, weekStart, userDispo)
    
    const nbHeuresSupDispo =   !allowOverTime ? ` ${userDispo.length - usersAssigned.length} ${template.job}(s) disponibles en heures supplémentaires.` : ''
    const warning = usersAssigned.length < template.quantityJob ?
      `Manque ${template.quantityJob - usersAssigned.length} ${template.job}(s) !${nbHeuresSupDispo}`
      : ''

    planning.push({ template, shiftDate, usersAssigned, warning })
    }
    return planning
}
 
// const userDisponible = await generatePlanning(new Date("2026-03-01"), false)
// console.log(JSON.stringify(userDisponible, null, 2))

type PlanningItem = {
  template: ShiftTemplate
  shiftDate: Date
  usersAssigned: any[]
  warning: string | null
}
export async function savePlanning(planning : PlanningItem[]){
      console.log("savePlanning appelé !")
for (const item of planning) {
        console.log("shiftDate:", item.shiftDate)
    for(const user of item.usersAssigned){
     await createShift({
        date: new Date(item.shiftDate),
        startTime: item.template.startTime,
        endTime: item.template.endTime,
        job: item.template.job,
        user: { connect: { id: user.id } },
        ShiftTemplate: { connect: { id: item.template.id } }
    })
    }}
}

function skipWrongTemplate(template : ShiftTemplate, weekStart : Date ){
// Garder la date ponctuelle seulement si dans la weekstart
        if (template.type === "PONCTUAL" && template.date) {
            const templateDate = new Date(template.date)
            return !(templateDate < weekStart || templateDate > new Date(weekStart.getTime()+ 7 * 24 * 60 * 60 * 1000))
        }
        return true
        }

 function filterContrainte(shiftDate : Date, users : any[], contraintes : Contrainte[], template : ShiftTemplate){
    // Filtrer personnes apte au job
            const userEligible = users.filter((user)=> user.job === template.job)

    // Filtrer ceux n'ayant pas de contraintes 
        const userDispo = userEligible.filter(user => {
            const aUneContrainte = contraintes.some(contrainte => {
                if (contrainte.userId !== user.id) return false
                
                const bonJour = contrainte.type === "PONCTUAL" ? 
                contrainte.date?.toDateString()=== shiftDate.toDateString() :
                contrainte.day === template.day

                if (!bonJour) return false
                return contrainte.startTime < template.endTime &&
                contrainte.endTime > template.startTime 
            })
            return !aUneContrainte
        })
        return userDispo
        }

async function filterHours (shiftDate : Date, allowOverTime : boolean = false, template : ShiftTemplate, weekStart : Date, userDispo : User[]){
        // Filter par heuresTravaillées
        const debutMois = new Date(weekStart.getFullYear(), weekStart.getMonth(), 1)
        const finMois = new Date(weekStart.getFullYear(), weekStart.getMonth() +1, 0)
        const usersWithHours = []
        for (const user of userDispo){
            const shift = await prisma.shift.findMany({
                where : {userId : user.id , date : {gte :debutMois, lte:finMois}}
            })
            const hours = shift.reduce((total, shift)=> {
                const start = parseInt(shift.startTime.split(':')[0])
                const end = parseInt(shift.endTime.split(':')[0])
                return total + (end - start)
            }, 0)
            usersWithHours.push({... user, heuresTravaillees : hours})
        }
         // trier par heures croissantes
        const usersSousContrat = allowOverTime ? usersWithHours :
        usersWithHours.filter((user)=> user.heuresTravaillees < (user.contractHours/35)*151.67)
        usersSousContrat.sort((a,b)=> a.heuresTravaillees - b.heuresTravaillees )

        // prendre seulement le nombre requis
  const usersAssigned = usersSousContrat.slice(0, template.quantityJob)
  
    return usersAssigned
}

function getDateForDay(weekStart: Date, day: DayOfWeek) {
  const days = {
    Lundi: 0,
    Mardi: 1,
    Mercredi: 2,
    Jeudi: 3,
    Vendredi: 4,
    Samedi: 5,
    Dimanche: 6
  }
  const result = new Date(weekStart)
  result.setDate(weekStart.getDate() + days[day])
  return result

}

async function checkShiftDispo(shiftDate : Date, users : any[], contraintes: Contrainte[],template:ShiftTemplate){
    const userDispo = filterContrainte(shiftDate, users, contraintes,template)
    const startOfDay = new Date(shiftDate)
startOfDay.setUTCHours(0, 0, 0, 0)
const endOfDay = new Date(shiftDate)
endOfDay.setUTCHours(23, 59, 59, 999)
  const shiftsDejaAssignes = await prisma.shift.count({
    where: {
      shiftTemplateId: template.id,
      date: { gte: startOfDay, lte: endOfDay }
    }
  })

  // Si déjà complet → retourner tableau vide
  if (shiftsDejaAssignes >= template.quantityJob) return []
    const userSansShift =[]
    for (const user of userDispo ){
    const shiftExistant =  await prisma.shift.findFirst({
        where : {
            userId : user.id,
            date : { gte: startOfDay, lte: endOfDay }
        }
    })
    console.log(`User ${user.name} - shiftExistant:`, shiftExistant?.date)
    console.log(`startOfDay:`, startOfDay, `endOfDay:`, endOfDay)
    
    if(!shiftExistant) userSansShift.push(user)
}
return userSansShift
}

// const testDate = getDateForDay(new Date("2025-03-10"), "Jeudi")
// console.log(testDate)