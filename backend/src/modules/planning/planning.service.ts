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
     weekStart = new Date(weekStart)
  weekStart.setUTCHours(0, 0, 0, 0)
    const shiftTemplate = await getAllShiftTemplate()
    const contraintes   = await UserService.getContrainte()
    const preferences   = await UserService.getPreference()
    const users         = await UserService.getAllUsers()
    const planning = []

    const slots = shiftTemplate
  .filter(t => skipWrongTemplate(t, weekStart))
  .map(template => {
    const shiftDate =
      template.type === "PONCTUAL"
        ? template.date
        : getDateForDay(weekStart, template.day!)

    if (!shiftDate) return null

    return {
      template,
      shiftDate: new Date(shiftDate)
    }
  })
  .filter((x): x is { template: any; shiftDate: Date } => x !== null)
  .sort((a, b) => {
  const diff =
    new Date(a.shiftDate).getTime() -
    new Date(b.shiftDate).getTime()

  if (diff !== 0) return diff

  return a.template.startTime.localeCompare(b.template.startTime)
})


    type MemoryShift = {
  userId: number
  date: Date
  startTime: string
  endTime: string
}
 const state = {
  dbShifts: await prisma.shift.findMany(),
  memoryShifts: [] as MemoryShift[]
}


for (const slot of slots) {

  const { template, shiftDate } = slot

  if (!shiftDate) continue

  const userDispo = await checkShiftDispo(
    shiftDate,
    users,
    contraintes,
    template,
    state.memoryShifts
  )

  const usersAssigned = await filterHours(
    shiftDate,
    allowOverTime,
    template,
    weekStart,
    userDispo,
    state.dbShifts,
    state.memoryShifts
  )

  for (const user of usersAssigned) {
    state.memoryShifts.push({
      userId: user.id,
      date: new Date(shiftDate),
      startTime: template.startTime,
      endTime: template.endTime,
    })
  }

  const nbHeuresSupDispo = !allowOverTime
    ? `${userDispo.length - usersAssigned.length} ${template.job}(s) dispo`
    : ""

  const warning =
    usersAssigned.length < template.quantityJob
      ? `Manque ${template.quantityJob - usersAssigned.length} ${template.job}(s) ! ${nbHeuresSupDispo}`
      : null

  planning.push({
    template,
    shiftDate,
    usersAssigned,
    warning
  })

  console.log(template.day, shiftDate.toISOString())
}

    planning.sort((a, b) =>
    new Date(a.shiftDate).getTime() - new Date(b.shiftDate).getTime()
    )
    
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

async function filterHours(
  shiftDate: Date,
  allowOverTime: boolean = false,
  template: ShiftTemplate,
  weekStart: Date,
  userDispo: User[],
  userShifts: { date: Date; userId: number | null }[],
  shiftsEnMemoire: {
    userId: number
    date: Date
    startTime: string
    endTime: string
  }[]
) {
  const debutMois = new Date(weekStart.getFullYear(), weekStart.getMonth(), 1)
  const finMois = new Date(weekStart.getFullYear(), weekStart.getMonth() + 1, 0)
  const usersWithHours = []

  for (const user of userDispo) {
    // Heures du mois
    const shiftsFromDB = await prisma.shift.findMany({
      where: { userId: user.id, date: { gte: debutMois, lte: finMois } },
    })

    const hoursFromDB = shiftsFromDB.reduce((total, shift) => {
      const start = parseInt(shift.startTime.split(':')[0])
      const end = parseInt(shift.endTime.split(':')[0])
      return total + (end - start)
    }, 0)

    const hoursFromMemory = shiftsEnMemoire
      .filter(s => s.userId === user.id)
      .reduce((total, s) => {
        const start = parseInt(s.startTime.split(':')[0])
        const end = parseInt(s.endTime.split(':')[0])
        return total + (end - start)
      }, 0)

    // Shifts pour la règle des jours consécutifs (fenêtre ±10 jours)
   // Remplace la fenêtre ±10 jours par des dates UTC explicites
const dix = 10 * 24 * 60 * 60 * 1000
const fenetreDebut = new Date(shiftDate)
fenetreDebut.setUTCHours(0, 0, 0, 0)
fenetreDebut.setTime(fenetreDebut.getTime() - dix)

const fenetreFin = new Date(shiftDate)
fenetreFin.setUTCHours(23, 59, 59, 999)
fenetreFin.setTime(fenetreFin.getTime() + dix)

const shiftsFromDBForRest = await prisma.shift.findMany({
  where: {
    userId: user.id,
    date: { gte: fenetreDebut, lte: fenetreFin },
  },
  select: { date: true, userId: true },
})

    // Combiner DB + mémoire pour les jours consécutifs
    const shiftsForRest = [
      ...shiftsFromDBForRest,
      ...shiftsEnMemoire
        .filter(s => s.userId === user.id)
        .map(s => ({ date: new Date(s.date), userId: s.userId })),
    ]

    usersWithHours.push({
      ...user,
      heuresTravaillees: hoursFromDB + hoursFromMemory,
      shiftsForRest,
    })
  }

  const usersSousContrat = allowOverTime
    ? usersWithHours
    : usersWithHours.filter(
        user => user.heuresTravaillees < (user.contractHours / 35) * 151.67
      )

  const usersRestOk = usersSousContrat.filter(user =>
    !hasTooManyConsecutiveDays(user.shiftsForRest, shiftDate)
  )

  usersRestOk.sort((a, b) => a.heuresTravaillees - b.heuresTravaillees)

  return usersRestOk.slice(0, template.quantityJob)
}

function getDateForDay(weekStart: Date, day: DayOfWeek) {
  const days = { Lundi: 0, Mardi: 1, Mercredi: 2, Jeudi: 3, Vendredi: 4, Samedi: 5, Dimanche: 6 }
  const result = new Date(weekStart)
  result.setUTCDate(weekStart.getUTCDate() + days[day]) // ✅ setUTCDate au lieu de setDate
  result.setUTCHours(0, 0, 0, 0)
  return result
}

async function checkShiftDispo(
  shiftDate: Date,
  users: any[],
  contraintes: Contrainte[],
  template: ShiftTemplate,
  shiftsEnMemoire: { userId: number; date: Date; startTime: string; endTime: string }[]
) {
  const startOfDay = new Date(shiftDate)
  startOfDay.setUTCHours(0, 0, 0, 0)
  const endOfDay = new Date(shiftDate)
  endOfDay.setUTCHours(23, 59, 59, 999)

  const userDispo = filterContrainte(shiftDate, users, contraintes, template)

  // Compter les shifts déjà en mémoire pour ce template + ce jour
  const shiftsEnMemoirePourTemplate = shiftsEnMemoire.filter(s => {
    const d = new Date(s.date)
    return d >= startOfDay && d <= endOfDay
    // Note : on ne peut pas filtrer par templateId ici car shiftsEnMemoire
    // ne le stocke pas — on considère qu'un user ne peut avoir qu'un shift par jour
  })

  const shiftsDejaAssignesDB = await prisma.shift.count({
    where: {
      shiftTemplateId: template.id,
      date: { gte: startOfDay, lte: endOfDay },
    },
  })

  const shiftsDejaAssignes = shiftsDejaAssignesDB + shiftsEnMemoirePourTemplate.length

  if (shiftsDejaAssignes >= template.quantityJob) return []

  const userSansShift = []

  for (const user of userDispo) {
    // Vérifier en mémoire
    const dejaEnMemoire = shiftsEnMemoire.some(
      s =>
        s.userId === user.id &&
        new Date(s.date) >= startOfDay &&
        new Date(s.date) <= endOfDay
    )
    if (dejaEnMemoire) continue

    // Vérifier en DB
    const shiftExistant = await prisma.shift.findFirst({
      where: {
        userId: user.id,
        date: { gte: startOfDay, lte: endOfDay },
      },
    })
    if (!shiftExistant) userSansShift.push(user)
  }

  return userSansShift
}
//chaque user doit avoir
// 2 jours consécutifs sans shift
// dans la semaine

function getDayNumber(date: Date) {
  return Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
}

function hasTooManyConsecutiveDays(
  userShifts: { date: Date | string; userId?: number | null }[],
  shiftDate: Date
): boolean {
  const current = getDayNumber(new Date(shiftDate))
  
  const days = new Set(
    userShifts.map(s => getDayNumber(new Date(s.date)))
  )

  // Simuler l'ajout du jour courant
  days.add(current)

  // Compter la séquence consécutive qui inclut current
  let streak = 0
  
  // Trouver le début de la séquence
  let start = current
  while (days.has(start - 1)) start--
  
  // Compter depuis le début
  let cursor = start
  while (days.has(cursor)) {
    streak++
    cursor++
  }

  return streak > 6
}






// 48h supp max max 
// + ajouter option max 35h - 42 ; 42h - 48h 
// > 220 c'est chaud 

//Oublie le shhuift permanent si ponctuel (fin pas oublie mais t'as capté )