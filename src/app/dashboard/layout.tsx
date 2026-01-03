
import Image from 'next/image'
import Link from 'next/link'
import { ClockWidget } from '@/components/clock-widget'

import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository'
import { GetUser } from '@/application/use-cases/user/GetUser'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { logoutAction } from '@/actions/auth-actions'
import SidebarResetButton from '@/components/sidebar-reset-button'

async function getUser() {
    const cookieStore = await cookies()
    const username = cookieStore.get('auth_user')?.value

    if (!username) return null

    const userRepository = new PrismaUserRepository()
    const getUserUseCase = new GetUser(userRepository)

    return await getUserUseCase.execute(username)
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }

    const currentDate = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="flex h-screen bg-gray-50 font-sans">

            {/* SIDEBAR (Izquierda) */}
            <aside className="w-64 bg-white shadow-sm flex flex-col border-r border-gray-200">

                {/* Título Sidebar */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-gray-800 font-bold text-lg">
                        Control de Asistencia
                    </h2>
                </div>

                {/* Menú de Navegación */}
                <nav className="flex-1 px-2 py-4 space-y-1">

                    <NavItem href="/dashboard/configuracion" label="Preferencias" icon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )} />

                    <NavItem href="/dashboard/matricula" label="Matrícula" icon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    )} />

                    <NavItem href="/dashboard/docentes" label="Docentes" icon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )} />

                    <NavItem href="/dashboard/administrativos" label="Administrativos" icon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    )} />

                    <NavItem href="/dashboard/obreros" label="Obreros" icon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    )} />

                    <NavItem href="/dashboard/madres-de-la-patria" label="Madres de la Patria" icon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    )} />

                </nav>

                {/* Footer Sidebar (Reset Period) */}
                <div className="p-4 border-t border-gray-200">
                    <SidebarResetButton />
                </div>
            </aside>

            {/* CONTENIDO DERECHA */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* HEADER SUPERIOR VERDE */}
                <header className="bg-[#009b70] text-white shadow-md px-6 flex justify-between items-center" style={{ height: '80px' }}>

                    {/* LADO IZQUIERDO: Logo y Nombre */}
                    {/* LADO IZQUIERDO: Logo y Nombre */}
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
                            <div className="bg-[#007a58] p-1.5 rounded-lg w-10 h-10 flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="MADA Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold leading-none tracking-wide text-white">MADA</h1>
                                <p className="text-xs opacity-90 tracking-wide text-white">Unidad Educativa Andrés Eloy Blanco</p>
                            </div>
                        </Link>
                    </div>

                    {/* LADO DERECHO: CONJUNTO FECHA - HORA/SALUDO - LOGOUT */}
                    <div className="flex items-center space-x-6">

                        {/* 1. Fecha en Píldora */}
                        <div className="bg-[#007a58] px-5 py-2 rounded-md text-sm font-medium tracking-wide shadow-sm">
                            {currentDate}
                        </div>

                        {/* 2. Columna Central: Hora Arriba, Saludo Abajo */}
                        <div className="flex flex-col items-center justify-center">
                            {/* Hora Grande */}
                            <div className="text-2xl font-bold leading-none mb-1">
                                <ClockWidget />
                            </div>
                            {/* Saludo Pequeño */}
                            <div className="text-sm font-medium text-white/90">
                                Buenas tardes, {user?.nombre || user?.username || 'Usuario'}
                            </div>
                        </div>

                        {/* 3. Columna Derecha: Logout */}
                        <div className="flex items-center justify-end">
                            <form action={logoutAction}>
                                <button type="submit" className="opacity-80 hover:opacity-100 transition-opacity ml-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </form>
                        </div>

                    </div>
                </header>

                {/* ÁREA DE CONTENIDO */}
                <main className="flex-1 overflow-auto bg-gray-50 p-6">
                    {children}
                </main>

            </div>
        </div>
    )
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-green-700 rounded-lg transition-colors group"
        >
            <div className="text-gray-400 group-hover:text-green-600 mr-3">
                {icon}
            </div>
            <span className="font-medium text-sm">{label}</span>
        </Link>
    )
}
