
'use server'

import { PrismaClient } from '@prisma/client'
// Importamos redirect pero NO lo usamos dentro del try/catch si queremos devolver errores al cliente
// Mejor devolvemos un objeto { success: true } y que el cliente redirija, o usamos redirect fuera.
// En Server Actions simples, redirect suele lanzar un error NEXT_REDIRECT que interrumpe el flujo, así que hay que tener cuidado.
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function loginAction(formData: FormData) {
    // 1. Extraer datos del formulario con seguridad
    const usuario = formData.get('usuario')
    const password = formData.get('password')

    // Validación estricta: Si son nulos o vacíos, devolvemos error
    if (!usuario || !password || usuario.toString().trim() === '') {
        return { success: false, message: 'Por favor complete todos los campos' }
    }

    const usuarioStr = usuario.toString()
    const passwordStr = password.toString()

    console.log('🔒 Intentando iniciar sesión:', usuarioStr)

    try {
        // 2. Buscar en la base de datos
        const userFound = await prisma.usuario.findUnique({
            where: { username: usuarioStr }
        })

        // 3. Verificar si existe y si la contraseña coincide
        if (!userFound || userFound.password !== passwordStr) {
            console.log('❌ Credenciales incorrectas')
            return { success: false, message: 'Usuario o contraseña incorrectos' }
        }

        console.log('✅ Login exitoso!')

        // 4. Crear Sesión en Cookie (Básica)
        const cookieStore = await cookies()
        cookieStore.set('auth_user', usuarioStr, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 semana
            path: '/',
        })

    } catch (error) {
        console.error('Error bases de datos:', error)
        return { success: false, message: 'Error de conexión con la base de datos' }
    }

    // 5. Redirigir
    redirect('/dashboard')
}

export async function logoutAction() {
    (await cookies()).delete('auth_user')
    redirect('/login')
}
