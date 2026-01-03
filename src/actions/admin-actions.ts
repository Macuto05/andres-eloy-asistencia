"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function resetSchoolPeriod() {
    try {
        // Transaction to ensure atomicity
        await prisma.$transaction([
            // Delete all Inasistencias (Daily absences)
            prisma.inasistencia.deleteMany({}),

            // Delete all RegistroMensual (Monthly attendance totals)
            prisma.registroMensual.deleteMany({})
        ])

        // Revalidate all dashboard pages
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/madres-de-la-patria')
        revalidatePath('/dashboard/matricula')
        revalidatePath('/dashboard/docentes')
        revalidatePath('/dashboard/administrativos')
        revalidatePath('/dashboard/obreros')

        return { success: true }
    } catch (error) {
        console.error("Error resetting school period:", error)
        return { success: false, error: "Error al reiniciar el periodo escolar" }
    }
}
