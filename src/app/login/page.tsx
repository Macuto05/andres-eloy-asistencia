
'use client'

import Image from 'next/image'
import { loginAction } from '@/actions/auth-actions'
import { useState } from 'react'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Función que maneja el envío del formulario
    // Función que maneja el envío del formulario
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('') // Limpiar errores previos

        const formData = new FormData(e.currentTarget)

        // Llamamos a la Server Action (el portero)
        const result = await loginAction(formData)

        // Si el portero nos devuelve algo (significa que hubo error, porque si fuera éxito redirigiría)
        if (result) {
            setError(result.message)
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* TARJETA BLANCA CENTRADA */}
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">

                {/* LOGO Y TÍTULO */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 mb-2">
                        <Image
                            src="/logo.png"
                            alt="Logo Andrés Eloy Blanco"
                            width={64}
                            height={64}
                        />
                    </div>
                    <h1 className="text-xl font-bold text-center text-gray-800">
                        Sistema de Control de<br />Asistencia
                    </h1>
                </div>

                {/* MENSAJE DE ERROR (Si existe) */}
                {error && (
                    <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                {/* FORMULARIO */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* CAMPO USUARIO */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Usuario
                        </label>
                        <input
                            name="usuario"
                            type="text"
                            placeholder="Ingrese su usuario"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm placeholder-gray-400 text-gray-900"
                        />
                    </div>

                    {/* CAMPO CONTRASEÑA */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                // Aquí está la magia del ojo: cambia entre 'text' y 'password'
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingrese su contraseña"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm placeholder-gray-400 text-gray-900"
                            />
                            {/* BOTÓN DEL OJO */}
                            <button
                                type="button" // Importante: type="button" para que NO envíe el formulario
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {/* Cambiamos el ícono según el estado */}
                                {showPassword ? (
                                    // Ícono de "Ojo Tachado" (Ocultar)
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    // Ícono de "Ojo Normal" (Ver)
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* BOTÓN INICIAR SESIÓN */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 text-sm font-medium text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center gap-2
              ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Iniciando sesión...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>

                </form>
            </div>
        </div>
    )
}
