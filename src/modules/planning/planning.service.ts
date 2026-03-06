import { prisma } from "../../../lib/prisma";
import { Prisma } from '../../../generated/prisma/client'
import * as UserService from "../users/users.service"
import { DayOfWeek } from "../../../generated/prisma/client";

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

// ShiftTemplater

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



export async function generatePlanning(weekStart : Date, allowOverTime : boolean=false){
    const shiftTemplate = await getAllShiftTemplate()
    const contraintes   = await UserService.getContrainte()
    const preferences   = await UserService.getPreference()
    const users         = await UserService.getAllUsers()
    const planning = []
    
    for(const template of shiftTemplate){

        if (template.type === "PONCTUAL" && template.date) {
            const templateDate = new Date(template.date)
            if (templateDate < weekStart || templateDate > new Date(weekStart.getTime()+ 7 * 24 * 60 * 60 * 1000)){
                 continue
            }
        }
        const shiftDate = template.type === "PONCTUAL" 
  ? template.date! 
  : getDateForDay(weekStart, template.day!)
if (!shiftDate) continue 
        const userEligible = users.filter((user)=> user.job === template.job)
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
    for (const user of usersAssigned) {
    await createShift({
        date: shiftDate,
        startTime: template.startTime,
        endTime: template.endTime,
        job: template.job,
        user: { connect: { id: user.id } },
        ShiftTemplate: { connect: { id: template.id } }
    })
    }
    const warning = usersAssigned.length < template.quantityJob ?
    `Manque ${template.quantityJob - usersAssigned.length} ${template.job}(s) !`
  : null
            planning.push({ template, usersAssigned, warning })
    }
    return planning
}
 
 const userDisponible = await generatePlanning(new Date("2026-03-09"), true)
console.log(JSON.stringify(userDisponible, null, 2))


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

const testDate = getDateForDay(new Date("2025-03-10"), "Jeudi")
console.log(testDate)