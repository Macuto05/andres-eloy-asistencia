"use client"

import { useState, useEffect } from "react"
import { PersonalConfig, DiasHabiles, RegistroMensual } from "@prisma/client"
import { saveAsistenciaMensual } from "@/actions/asistencia-actions"
import { generateAndDownloadCSV } from "@/lib/export-utils"

interface AdministrativosClientProps {
    personalData: PersonalConfig[]
    diasHabiles: DiasHabiles[]
    registros: RegistroMensual[]
}

const MONTHS = [
    "Septiembre", "Octubre", "Noviembre", "Diciembre",
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"
]

import AddInasistenciaModal from "./add-inasistencia-modal"
import ViewInasistenciasModal from "./view-inasistencias-modal"

export default function AdministrativosClient({ personalData, diasHabiles, registros }: AdministrativosClientProps) {
    const [selectedMonth, setSelectedMonth] = useState("Enero")

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedNivel, setSelectedNivel] = useState("")

    // Local state for optimistic updates
    const [inputValues, setInputValues] = useState<Record<string, number>>({})

    // Initialize inputs when Month or Registros change
    useEffect(() => {
        const initialValues: Record<string, number> = {}
        personalData.forEach(p => {
            const match = registros.find(r =>
                r.mes === selectedMonth &&
                r.nivel === p.nivel
            )
            initialValues[p.nivel] = match?.asistenciaMensual || 0
        })
        setInputValues(initialValues)
    }, [selectedMonth, registros, personalData])

    // Get Dias Habiles for selected month
    const diasHabilesDelMes = diasHabiles.find(d => d.mes === selectedMonth)?.cantidad || 0

    const handleInputChange = (nivel: string, val: string) => {
        const num = parseInt(val) || 0
        setInputValues(prev => ({ ...prev, [nivel]: num }))
    }

    const handleBlur = async (nivel: string) => {
        const valor = inputValues[nivel] || 0
        // Save to DB (No Year)
        await saveAsistenciaMensual(selectedMonth, "Administrativo", nivel, valor)
    }

    const openAddModal = (nivel: string) => {
        setSelectedNivel(nivel)
        setIsAddModalOpen(true)
    }

    const openViewModal = (nivel: string) => {
        setSelectedNivel(nivel)
        setIsViewModalOpen(true)
    }

    return (
        <div className="w-full relative">
            {/* Modal Injection */}
            <AddInasistenciaModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                nivel={selectedNivel}
                mes={selectedMonth}
                cargo="Administrativo"
            />

            <ViewInasistenciasModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                nivel={selectedNivel}
                mes={selectedMonth}
                cargo="Administrativo"
            />

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Administrativos</h1>

            {/* Selector de Meses */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 overflow-x-auto">
                <div className="flex space-x-2">
                    {MONTHS.map((m) => (
                        <button
                            key={m}
                            onClick={() => setSelectedMonth(m)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedMonth === m
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabla de Datos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th className="py-3 pl-2">Nivel Educativo</th>
                                <th className="py-3 text-center">Varones</th>
                                <th className="py-3 text-center">Hembras</th>
                                <th className="py-3 text-center">Total</th>
                                <th className="py-3 text-center">Días Hábiles</th>
                                <th className="py-3 text-center">Asistencia del Mes</th>
                                <th className="py-3 text-center">Promedio</th>
                                <th className="py-3 text-center">Porcentaje</th>
                                <th className="py-3 text-center">Inasistencia del Mes</th>
                                <th className="py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                            {personalData.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-8 text-center text-gray-500 italic">
                                        No hay personal registrado como "Administrativo".
                                    </td>
                                </tr>
                            ) : (
                                personalData.map((item) => {
                                    const totalPersonal = item.cantidadVarones + item.cantidadHembras
                                    const asistenciaInput = inputValues[item.nivel] ?? 0

                                    // CALCULATIONS
                                    const targetAsistencia = totalPersonal * diasHabilesDelMes
                                    // Inasistencia = Target - Real
                                    const inasistencia = diasHabilesDelMes > 0 ? (targetAsistencia - asistenciaInput) : 0

                                    // Promedio = AsistenciaReal / DiasHabiles
                                    const promedio = diasHabilesDelMes > 0 ? (asistenciaInput / diasHabilesDelMes).toFixed(1) : "0"

                                    // Percentage = (AsistenciaReal / Target) * 100
                                    const porcentaje = targetAsistencia > 0
                                        ? ((asistenciaInput / targetAsistencia) * 100).toFixed(1) + "%"
                                        : "0%"

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="py-4 pl-2 font-medium text-gray-900 align-middle">{item.nivel}</td>
                                            <td className="py-4 text-center text-gray-600 align-middle">{item.cantidadVarones}</td>
                                            <td className="py-4 text-center text-gray-600 align-middle">{item.cantidadHembras}</td>
                                            <td className="py-4 text-center font-bold text-gray-900 align-middle">{totalPersonal}</td>

                                            <td className="py-4 text-center text-gray-900 align-middle">{diasHabilesDelMes}</td>

                                            {/* Column: Asistencia del Mes (INPUT) */}
                                            <td className="py-4 text-center align-middle">
                                                <div className="relative flex justify-center items-center gap-1 mx-auto h-full">
                                                    <input
                                                        type="number"
                                                        className="w-20 text-center border border-gray-300 rounded-md py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-300 transition-all shadow-sm"
                                                        placeholder={targetAsistencia.toString()}
                                                        title={`Máximo: ${targetAsistencia}`}
                                                        value={asistenciaInput === 0 ? "" : asistenciaInput}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            if (val === "") {
                                                                handleInputChange(item.nivel, "0")
                                                                return
                                                            }
                                                            const num = parseInt(val)
                                                            if (!isNaN(num)) {
                                                                const clamped = Math.min(Math.max(0, num), targetAsistencia)
                                                                handleInputChange(item.nivel, clamped.toString())
                                                            }
                                                        }}
                                                        onBlur={() => handleBlur(item.nivel)}
                                                    />
                                                    <span className="absolute -bottom-5 text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                        Max: {targetAsistencia}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Column: Promedio */}
                                            <td className="py-4 text-center text-gray-700 align-middle">{promedio}</td>

                                            {/* Column: Porcentaje */}
                                            <td className="py-4 text-center font-medium text-blue-600 align-middle">{porcentaje}</td>

                                            {/* Column: Inasistencia del Mes (CALCULATED) */}
                                            <td className="py-4 text-center text-red-600 font-medium align-middle">
                                                {Math.max(0, inasistencia)}
                                            </td>

                                            <td className="py-4 text-center align-middle">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => openAddModal(item.nivel)}
                                                        className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 text-gray-700 transition-colors"
                                                    >
                                                        Añadir
                                                    </button>
                                                    <button
                                                        onClick={() => openViewModal(item.nivel)}
                                                        className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 text-gray-700 transition-colors"
                                                    >
                                                        Ver
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}

                        </tbody>
                    </table>
                </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={() => {
                        const reportTitle = "REPORTE DE ASISTENCIA - ADMINISTRATIVOS"
                        const period = selectedMonth.toUpperCase()
                        const filename = `asistencia_administrativos_${selectedMonth.toLowerCase()}_${new Date().getFullYear()}.csv`

                        const headers = ["Nivel Educativo", "Varones", "Hembras", "Total", "Días Hábiles", "Asistencia del Mes", "Promedio", "Porcentaje", "Inasistencia del Mes"]

                        let sumVarones = 0
                        let sumHembras = 0
                        let sumTotalPersonal = 0
                        let sumAsistencia = 0
                        let sumInasistencia = 0

                        const dataRows = personalData.map(item => {
                            const totalPersonal = item.cantidadVarones + item.cantidadHembras
                            const asistenciaInput = inputValues[item.nivel] ?? 0
                            const targetAsistencia = totalPersonal * diasHabilesDelMes
                            const inasistencia = diasHabilesDelMes > 0 ? (targetAsistencia - asistenciaInput) : 0
                            const promedio = diasHabilesDelMes > 0 ? (asistenciaInput / diasHabilesDelMes).toFixed(1) : "0"
                            const porcentaje = targetAsistencia > 0 ? ((asistenciaInput / targetAsistencia) * 100).toFixed(1) + "%" : "0%"

                            // Accumulate Totals
                            sumVarones += item.cantidadVarones
                            sumHembras += item.cantidadHembras
                            sumTotalPersonal += totalPersonal
                            sumAsistencia += asistenciaInput
                            sumInasistencia += Math.max(0, inasistencia)

                            return [
                                `"${item.nivel}"`,
                                item.cantidadVarones,
                                item.cantidadHembras,
                                totalPersonal,
                                diasHabilesDelMes,
                                asistenciaInput,
                                `"${promedio}"`,
                                `"${porcentaje}"`,
                                Math.max(0, inasistencia)
                            ]
                        })

                        const totalsRow = [
                            "TOTALES",
                            sumVarones,
                            sumHembras,
                            sumTotalPersonal,
                            "",
                            sumAsistencia,
                            "",
                            "",
                            sumInasistencia
                        ]

                        generateAndDownloadCSV(filename, reportTitle, period, headers, dataRows, totalsRow)
                    }}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Exportar a Excel</span>
                </button>
            </div>
        </div>
    )
}
