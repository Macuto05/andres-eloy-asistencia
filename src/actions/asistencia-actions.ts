"use server"
// Actions for Monthly Attendance

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function saveAsistenciaMensual(
    mes: string,
    tipoPersonal: string,
    nivel: string,
    valor: number
) {
    try {
        await prisma.registroMensual.upsert({
            where: {
                registro_unico_mensual: {
                    mes,
                    tipoPersonal,
                    nivel
                }
            },
            update: {
                asistenciaMensual: valor
            },
            create: {
                mes,
                tipoPersonal,
                nivel,
                asistenciaMensual: valor
            }
        })

        revalidatePath('/dashboard/madres-de-la-patria')
        return { success: true }
    } catch (error) {
        console.error("Error saving asistencia:", error)
        return { success: false, error: "Error al guardar" }
    }
}
