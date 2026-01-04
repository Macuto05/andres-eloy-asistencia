"use client"

import { useState } from "react"
import { addInasistencia } from "@/actions/inasistencia-actions"
import { toast } from "sonner"

interface AddInasistenciaModalProps {
    isOpen: boolean
    onClose: () => void
    nivel: string // "Primaria" (This is the group)
    grado: string // The specific grade "1er Grado"
    seccionGroup: string // "Inicial", "Primaria" etc (The high level group)
    mes: string
    cargo: string // "Estudiante"
}

export default function AddInasistenciaModal({ isOpen, onClose, grado, seccionGroup, mes, cargo }: AddInasistenciaModalProps) {
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [seccion, setSeccion] = useState("")
    const [tipoInasistencia, setTipoInasistencia] = useState<"dia" | "periodo">("dia")
    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFin, setFechaFin] = useState("") // Fecha de Reintegro
    const [justificada, setJustificada] = useState(false)
    const [justificacion, setJustificacion] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        if (!fechaInicio) {
            toast.error("Debes seleccionar una fecha")
            setIsSubmitting(false)
            return
        }

        if (tipoInasistencia === "periodo" && !fechaFin) {
            toast.error("Debes seleccionar una fecha de reintegro")
            setIsSubmitting(false)
            return
        }

        const res = await addInasistencia({
            nombre,
            apellido,
            cargo,
            nivel: grado, // Kept for list compatibility
            grado: grado, // Explicit
            seccion: seccion, // User input
            justificada,
            justificacion: justificada ? justificacion : undefined,
            tipoInasistencia,
            fechaInicio: new Date(fechaInicio),
            fechaFin: fechaFin ? new Date(fechaFin) : undefined
        })

        if (res.success) {
            toast.success("Inasistencia guardada correctamente")
            // Reset form
            setNombre("")
            setApellido("")
            setSeccion("")
            setTipoInasistencia("dia")
            setFechaInicio("")
            setFechaFin("")
            setJustificada(false)
            setJustificacion("")
            onClose()
        } else {
            toast.error("Error al guardar: " + res.error)
        }
        setIsSubmitting(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Añadir inasistencia</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase tracking-wide">
                                {cargo}
                            </span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide">
                                {seccionGroup}
                            </span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 uppercase tracking-wide">
                                {grado}
                            </span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 uppercase tracking-wide">
                                {mes}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">

                    {/* Nombre y Apellido */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Nombre del Estudiante</label>
                            <input
                                type="text"
                                required
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
                                placeholder="Nombre"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Apellido</label>
                            <input
                                type="text"
                                required
                                value={apellido}
                                onChange={e => setApellido(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
                                placeholder="Apellido"
                            />
                        </div>
                    </div>

                    {/* Cargo */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Cargo</label>
                        <input
                            type="text"
                            readOnly
                            value={cargo}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Grado y Sección */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Grado / Año</label>
                            <input
                                type="text"
                                readOnly
                                value={grado}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Sección</label>
                            <input
                                type="text"
                                required
                                value={seccion}
                                onChange={e => setSeccion(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase text-gray-900"
                                placeholder="A, B, U..."
                                maxLength={5}
                            />
                        </div>
                    </div>


                    {/* Tipo de Inasistencia */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo de inasistencia</label>
                        <select
                            value={tipoInasistencia}
                            onChange={(e) => setTipoInasistencia(e.target.value as "dia" | "periodo")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-gray-900"
                        >
                            <option value="dia">Crear inasistencia para un dia</option>
                            <option value="periodo">Crear inasistencia por periodo</option>
                        </select>
                    </div>

                    {/* Fechas */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {tipoInasistencia === "dia" ? "Fecha de inasistencia" : "Fecha de Inicio"}
                        </label>
                        <input
                            type="date"
                            required
                            value={fechaInicio}
                            onChange={e => setFechaInicio(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
                        />
                    </div>

                    {tipoInasistencia === "periodo" && (
                        <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Fecha de Reintegro</label>
                            <input
                                type="date"
                                required
                                value={fechaFin}
                                min={fechaInicio}
                                onChange={e => setFechaFin(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
                            />
                            <p className="text-[10px] text-gray-400">Se registrarán inasistencias desde la fecha de inicio hasta el día anterior al reintegro.</p>
                        </div>
                    )}

                    {/* Justificación */}
                    <div className="pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={justificada}
                                onChange={e => setJustificada(e.target.checked)}
                                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-all"
                            />
                            <span className="text-sm font-medium text-gray-700">¿Es inasistencia justificada?</span>
                        </label>

                        {justificada && (
                            <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200 space-y-1">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Justificación</label>
                                <textarea
                                    value={justificacion}
                                    onChange={e => setJustificacion(e.target.value)}
                                    rows={3}
                                    required={justificada}
                                    placeholder="Indique el motivo médico o personal..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-gray-900"
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
