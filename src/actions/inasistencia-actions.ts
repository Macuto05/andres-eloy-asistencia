"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export async function addInasistencia(data: {
    nombre: string
    apellido: string
    cargo: string
    nivel: string
    justificada: boolean
    justificacion?: string

    seccion?: string
    grado?: string // Explicitly added for students

    // Logic for Single Day or Range
    tipoInasistencia: "dia" | "periodo"
    fechaInicio: Date
    fechaFin?: Date // Only for period
}) {
    try {
        const recordsToCreate = []

        if (data.tipoInasistencia === "dia") {
            // Single Record
            recordsToCreate.push(data.fechaInicio)
        } else if (data.tipoInasistencia === "periodo" && data.fechaFin) {
            // Range: Create a record for each day from Start to End (inclusive or exclusive? Usually inclusive for Start, what about End? User said "Fecha de Reintegro", implying they return THAT day, so they are absent UNTIL that day.)
            // Logic: Absent from [Start, End).

            let currentDate = new Date(data.fechaInicio)
            const endDate = new Date(data.fechaFin)

            // Loop while currentDate < endDate
            while (currentDate < endDate) {
                recordsToCreate.push(new Date(currentDate))
                currentDate.setDate(currentDate.getDate() + 1)
            }
        }

        // Batch Create
        for (const date of recordsToCreate) {
            // Derive Mes from the date
            const mesIndex = date.getMonth() // 0-11
            const mesNombre = MONTHS[mesIndex]

            await prisma.inasistencia.create({
                data: {
                    fecha: date,
                    mes: mesNombre, // Derived from date
                    nombre: data.nombre,
                    apellido: data.apellido,
                    cargo: data.cargo,
                    nivel: data.nivel,
                    grado: data.grado, // New field
                    seccion: data.seccion, // New field
                    justificada: data.justificada,
                    justificacion: data.justificada ? data.justificacion : null
                }
            })
        }

        revalidatePath('/dashboard/madres-de-la-patria')
        return { success: true, count: recordsToCreate.length }
    } catch (error) {
        console.error("Error creating inasistencia:", error)
        return { success: false, error: "Error al registrar inasistencia" }
    }
}


export async function getInasistencias(
    mes: string,
    cargo: string,
    nivel: string
) {
    try {
        const records = await prisma.inasistencia.findMany({
            where: {
                mes,
                cargo,
                nivel
            },
            orderBy: { fecha: 'asc' }
        })
        return { success: true, data: records }
    } catch (error) {
        console.error("Error fetching inasistencias:", error)
        return { success: false, error: "Error al obtener datos" }
    }
}
