'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateUserProfile } from '@/actions/user-actions'
import { savePersonalAction } from '@/actions/personal-actions'
import { updateCredentialsAction } from '@/actions/credentials-actions'
import { saveDiasHabilesAction } from '@/actions/dias-habiles-actions'
import { saveMatriculaAction } from '@/actions/matricula-actions'
import { User } from '@/domain/entities/User'
import { Matricula } from '@/domain/entities/Matricula'
import { Personal } from '@/domain/entities/Personal'
import { DiasHabiles } from '@/domain/entities/DiasHabiles'
import { CredentialsForm } from './credentials-form'
import { AddGradeModal } from './add-grade-modal'
import { AddPersonalModal } from './add-personal-modal'

interface Props {
    user: User | null;
    initialMatricula: Matricula[];
    initialPersonal: Personal[];
    initialDiasHabiles: DiasHabiles[];
}

export default function ConfiguracionClient({ user, initialMatricula, initialPersonal, initialDiasHabiles }: Props) {
    const [activeTab, setActiveTab] = useState('Usuario')
    const [loading, setLoading] = useState(false)

    // State for Matrícula (Controlled)
    const [matriculaData, setMatriculaData] = useState<Matricula[]>(initialMatricula)

    // Modal State
    // Modal State
    const [isAddGradeOpen, setIsAddGradeOpen] = useState(false)
    const [isAddPersonalOpen, setIsAddPersonalOpen] = useState(false)

    // State for Personal (Controlled)
    const [personalData, setPersonalData] = useState<Personal[]>(initialPersonal)

    // State for Dias Hábiles (Controlled)
    const [diasHabilesData, setDiasHabilesData] = useState<DiasHabiles[]>(initialDiasHabiles)

    // --- MANEJADORES GENERALES ---

    async function handleUpdateProfile(formData: FormData) {
        setLoading(true)
        const res = await updateUserProfile(formData)
        setLoading(false)
        if (res.success) {
            toast.success('Perfil actualizado')
        } else {
            toast.error('Error: ' + res.message)
        }
    }

    async function handleUpdateCredentials(formData: FormData) {
        setLoading(true)
        // Agregamos el username actual al FormData para que el Server Action sepa a quién buscar
        formData.append('currentUsername', user?.username || '');

        const res = await updateCredentialsAction(formData)
        setLoading(false)
        if (res.success) {
            toast.success('Credenciales actualizadas')
        } else {
            toast.error('Error: ' + res.message)
        }
    }

    // --- LÓGICA MATRÍCULA ---

    // 1. Abrir Modal
    const openAddGradeModal = () => {
        setIsAddGradeOpen(true)
    }

    // 2. Crear Grado (Callback del Modal)
    const handleCreateGrado = async (nivel: string, grado: string) => {
        const newEntry: Matricula = {
            id: Date.now(), // ID temporal
            nivel,
            grado,
            secciones: 1, // Default
            varones: 0,
            hembras: 0
        }

        const newData = [...matriculaData, newEntry]
        setMatriculaData(newData)

        // Auto-save REMOVED to allow manual save only
        // try {
        //     await saveMatriculaAction(newData)
        // } catch (e) {
        //     console.error(e)
        //     toast.error("Error al guardar el nuevo grado en base de datos")
        // }
    }

    // 3. Eliminar Grado
    const handleDeleteGrado = async (index: number) => {
        const gradeToDelete = matriculaData[index]
        const confirmMsg = `¿Estás seguro que deseas eliminar ${gradeToDelete.grado} (${gradeToDelete.nivel})?\nEsta acción eliminará el registro de la base de datos.`

        if (window.confirm(confirmMsg)) {
            const newData = matriculaData.filter((_, i) => i !== index)
            setMatriculaData(newData)

            // Auto-save REMOVED
            // try {
            //     await saveMatriculaAction(newData)
            // } catch (e) {
            //     console.error(e)
            //     toast.error("Error al eliminar de la base de datos")
            // }
        }
    }

    const updateMatriculaField = (index: number, field: keyof Matricula, value: any) => {
        // Validación: No permitir números negativos
        if (typeof value === 'number' && value < 0) return;

        const newData = [...matriculaData];
        newData[index] = { ...newData[index], [field]: value };
        setMatriculaData(newData);
    }

    const handleSaveMatricula = async () => {
        const res = await saveMatriculaAction(matriculaData);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    }

    // --- LÓGICA PERSONAL ---

    const handleCreatePersonal = async (tipo: string, niveles: string[]) => {
        const newEntries: Personal[] = niveles.map((nivel, i) => ({
            id: Date.now() + i, // Offset ID to avoid collision
            tipo,
            nivel,
            varones: 0,
            hembras: 0
        }));

        const newData = [...personalData, ...newEntries];
        setPersonalData(newData);

        // Auto-save REMOVED
        // try {
        //     await savePersonalAction(newData);
        // } catch (e) {
        //     console.error(e);
        //     toast.error("Error al guardar personal");
        // }
    }

    const handleDeletePersonal = async (index: number) => {
        const itemToDelete = personalData[index]
        const confirmMsg = `¿Estás seguro que deseas eliminar ${itemToDelete.tipo} - ${itemToDelete.nivel}?`

        if (window.confirm(confirmMsg)) {
            const newData = personalData.filter((_, i) => i !== index)
            setPersonalData(newData)

            // try {
            //     await savePersonalAction(newData)
            // } catch (e) {
            //     console.error(e)
            //     toast.error("Error al eliminar personal")
            // }
        }
    }

    const updatePersonalField = (index: number, field: keyof Personal, value: any) => {
        // Validación: No permitir números negativos
        if (typeof value === 'number' && value < 0) return;

        const newData = [...personalData];
        newData[index] = { ...newData[index], [field]: value };
        setPersonalData(newData);
    }

    const handleSavePersonal = async () => {
        const res = await savePersonalAction(personalData);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    }

    // --- LÓGICA DÍAS HÁBILES ---

    const getMaxDays = (mes: string) => {
        const m = mes.toLowerCase().trim()
        if (m === 'febrero') return 29
        if (['abril', 'junio', 'septiembre', 'noviembre'].includes(m)) return 30
        return 31
    }

    const updateDiasHabilesField = (index: number, value: number) => {
        const item = diasHabilesData[index]
        const maxHeaders = getMaxDays(item.mes)

        // Validación: No permitir negativos ni exceder días del mes
        if (value < 0) value = 0
        if (value > maxHeaders) value = maxHeaders

        const newData = [...diasHabilesData];
        newData[index] = { ...newData[index], cantidad: value };
        setDiasHabilesData(newData);
    }

    const handleSaveDiasHabiles = async () => {
        const res = await saveDiasHabilesAction(diasHabilesData);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    }

    const tabs = ['Usuario', 'Credenciales', 'Días Hábiles', 'Matrícula', 'Personal']

    return (
        <div className="max-w-5xl mx-auto">
            {/* Modal de Agregar Grado */}
            <AddGradeModal
                isOpen={isAddGradeOpen}
                onClose={() => setIsAddGradeOpen(false)}
                onCreate={handleCreateGrado}
                existingGrades={matriculaData}
            />

            {/* Modal de Agregar Personal */}
            <AddPersonalModal
                isOpen={isAddPersonalOpen}
                onClose={() => setIsAddPersonalOpen(false)}
                onCreate={handleCreatePersonal}
                existingPersonal={personalData}
            />

            {/* Pestañas SUPERIORES */}
            <div className="flex items-center space-x-1 mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab ? 'bg-white text-gray-800 shadow-sm border-t border-x border-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 min-h-[400px]">

                {/* USUARIO */}
                {activeTab === 'Usuario' && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Preferencias de Usuario</h2>
                        <p className="text-gray-500 text-sm mb-8">Actualiza tu información de perfil</p>
                        <form action={handleUpdateProfile} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre completo</label>
                                <input name="nombre" type="text" defaultValue={user?.nombre || ''} placeholder="Tu nombre" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow" />
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={loading} className="w-full py-3 bg-[#007a58] text-white font-medium rounded-lg hover:bg-[#006045] transition-colors shadow-sm disabled:opacity-50">
                                    {loading ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* CREDENCIALES (Conectado y Mejorado) */}
                {activeTab === 'Credenciales' && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Credenciales de Acceso</h2>
                        <p className="text-gray-500 text-sm mb-8">Actualiza tu usuario y contraseña</p>
                        <CredentialsForm user={user} updateAction={updateCredentialsAction} />
                    </div>
                )}

                {/* DIAS HÁBILES (Conectado) */}
                {activeTab === 'Días Hábiles' && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Configuración de Días Hábiles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                            {diasHabilesData.map((d, index) => (
                                <div key={d.mes}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{d.mes}</label>
                                    <input
                                        type="number"
                                        value={d.cantidad}
                                        onChange={(e) => updateDiasHabilesField(index, parseInt(e.target.value) || 0)}
                                        min={0}
                                        max={getMaxDays(d.mes)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="pt-6">
                            <button
                                onClick={handleSaveDiasHabiles}
                                type="button"
                                className="w-full py-3 bg-[#007a58] text-white font-medium rounded-lg hover:bg-[#006045] transition-colors shadow-sm"
                            >
                                Guardar días hábiles
                            </button>
                        </div>
                    </div>
                )}

                {/* MATRÍCULA */}
                {activeTab === 'Matrícula' && (
                    <div className="w-full">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Configuración de Matrícula</h2>
                                <p className="text-gray-500 text-sm">Establece la cantidad de alumnos por nivel educativo</p>
                            </div>
                            <button
                                onClick={openAddGradeModal}
                                className="px-4 py-2 bg-[#007a58] text-white text-sm font-medium rounded-lg hover:bg-[#006045] transition-all flex items-center shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar Grado
                            </button>
                        </div>

                        <div className="space-y-6 mb-8">
                            {matriculaData
                                .sort((a, b) => {
                                    const order = { 'Inicial': 1, 'Primaria': 2, 'Media General': 3 };
                                    const levelA = a.nivel as keyof typeof order;
                                    const levelB = b.nivel as keyof typeof order;
                                    if ((order[levelA] || 99) !== (order[levelB] || 99)) {
                                        return (order[levelA] || 99) - (order[levelB] || 99);
                                    }
                                    return a.grado.localeCompare(b.grado);
                                })
                                .map((item, index) => (
                                    <div key={item.id || index} className="p-6 border border-gray-100 rounded-lg shadow-sm relative group bg-white hover:border-[#007a58]/30 transition-colors">

                                        {/* Botón de Eliminar (Basura) */}
                                        <button
                                            onClick={() => handleDeleteGrado(index)}
                                            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                            title="Eliminar registro de base de datos"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>

                                        {/* Badge de Nivel */}
                                        <div className="absolute top-0 left-0 mt-4 ml-6">
                                            <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md 
                                            ${item.nivel === 'Inicial' ? 'bg-purple-100 text-purple-700' :
                                                    item.nivel === 'Primaria' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-orange-100 text-orange-700'}`}>
                                                {item.nivel}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Grado</label>
                                                <input
                                                    type="text"
                                                    value={item.grado}
                                                    readOnly // Ahora es readOnly porque se selecciona en el modal
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Secciones</label>
                                                <input
                                                    type="number"
                                                    value={item.secciones}
                                                    onChange={(e) => updateMatriculaField(index, 'secciones', parseInt(e.target.value) || 0)}
                                                    min={0}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Varones</label>
                                                <input
                                                    type="number"
                                                    value={item.varones}
                                                    onChange={(e) => updateMatriculaField(index, 'varones', parseInt(e.target.value) || 0)}
                                                    min={0}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Hembras</label>
                                                <input
                                                    type="number"
                                                    value={item.hembras}
                                                    onChange={(e) => updateMatriculaField(index, 'hembras', parseInt(e.target.value) || 0)}
                                                    min={0}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {matriculaData.length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">No hay grados registrados</h3>
                                    <p className="text-gray-500 mt-1">Utiliza el botón "Agregar Grado" para comenzar.</p>
                                </div>
                            )}
                        </div>
                        <div className="pt-2">
                            <button onClick={handleSaveMatricula} type="button" className="w-full py-3 bg-[#007a58] text-white font-medium rounded-lg hover:bg-[#006045] transition-colors shadow-sm">Guardar configuración de matrícula</button>
                        </div>
                    </div>
                )}

                {/* PERSONAL */}
                {activeTab === 'Personal' && (
                    <div className="w-full">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Configuración de Personal</h2>
                                <p className="text-gray-500 text-sm">Establece la cantidad de personal por categoría y nivel</p>
                            </div>
                            <button
                                onClick={() => setIsAddPersonalOpen(true)} // Open Modal
                                className="px-4 py-2 bg-[#007a58] text-white text-sm font-medium rounded-lg hover:bg-[#006045] transition-all flex items-center shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar Personal
                            </button>
                        </div>

                        <div className="space-y-10 mb-8">
                            {/* Group logic: Get Unique Types */}
                            {Array.from(new Set(personalData.map(p => p.tipo))).map((tipo) => (
                                <div key={tipo} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-[#007a58]">{tipo}s</h3>
                                        <button
                                            onClick={() => {
                                                if (confirm(`¿Realmente quieres eliminar todos los registros de ${tipo}?`)) {
                                                    // Filter out all items of this type
                                                    const newData = personalData.filter(p => p.tipo !== tipo);
                                                    setPersonalData(newData);
                                                    // savePersonalAction(newData).catch(err => {
                                                    //     console.error(err);
                                                    //     toast.error("Error al eliminar el grupo");
                                                    // });
                                                }
                                            }}
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                            title={`Eliminar todo el grupo de ${tipo}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {personalData
                                            .map((item, originalIndex) => ({ item, originalIndex })) // Keep track of original index
                                            .filter(({ item }) => item.tipo === tipo)
                                            .sort((a, b) => {
                                                const order = { 'Inicial': 1, 'Primaria': 2, 'Media General': 3 };
                                                const levelA = a.item.nivel as keyof typeof order;
                                                const levelB = b.item.nivel as keyof typeof order;
                                                return (order[levelA] || 99) - (order[levelB] || 99);
                                            })
                                            .map(({ item, originalIndex }) => (
                                                <div key={item.id} className="relative p-5 rounded-xl border border-gray-200 hover:border-[#007a58]/50 transition-colors group bg-white">

                                                    {/* Botón Eliminar (X pequeña) */}
                                                    <button
                                                        onClick={() => handleDeletePersonal(originalIndex)}
                                                        className="absolute -top-2 -right-2 bg-white text-gray-300 hover:text-red-500 border border-gray-200 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                                        title="Eliminar registro"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>

                                                    <h4 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                                                        <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md 
                                                            ${item.nivel === 'Inicial' ? 'bg-purple-100 text-purple-700' :
                                                                item.nivel === 'Primaria' ? 'bg-blue-100 text-blue-700' :
                                                                    item.nivel === 'Media General' ? 'bg-orange-100 text-orange-700' :
                                                                        'bg-gray-100 text-gray-700'}`}>
                                                            {item.nivel}
                                                        </span>
                                                    </h4>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Varones</label>
                                                            <input
                                                                type="number"
                                                                value={item.varones}
                                                                onChange={(e) => updatePersonalField(originalIndex, 'varones', parseInt(e.target.value) || 0)}
                                                                min={0}
                                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007a58] focus:bg-white transition-all text-sm font-medium"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Hembras</label>
                                                            <input
                                                                type="number"
                                                                value={item.hembras}
                                                                onChange={(e) => updatePersonalField(originalIndex, 'hembras', parseInt(e.target.value) || 0)}
                                                                min={0}
                                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007a58] focus:bg-white transition-all text-sm font-medium"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}

                            {personalData.length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">No hay personal configurado</h3>
                                    <p className="text-gray-500 mt-1">Comienza agregando los cargos y niveles educativos de tu institución.</p>
                                </div>
                            )}
                        </div>
                        <div className="pt-2">
                            <button onClick={handleSavePersonal} type="button" className="w-full py-3 bg-[#007a58] text-white font-medium rounded-lg hover:bg-[#006045] transition-colors shadow-sm">Guardar configuración de personal</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
