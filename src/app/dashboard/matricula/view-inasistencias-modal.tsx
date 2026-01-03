"use client"

import { useState, useEffect } from "react"
import { getInasistencias } from "@/actions/inasistencia-actions"

interface ViewInasistenciasModalProps {
    isOpen: boolean
    onClose: () => void
    grado: string // The specific grade "1er Grado" - Used as 'nivel' in fetching
    seccionGroup: string // "Primaria"
    mes: string
    cargo: string // "Estudiante"
}

export default function ViewInasistenciasModal({ isOpen, onClose, grado, seccionGroup, mes, cargo }: ViewInasistenciasModalProps) {
    const [registros, setRegistros] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const [selectedJustification, setSelectedJustification] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            loadData()
        }
    }, [isOpen, grado, mes, cargo])

    const loadData = async () => {
        setLoading(true)
        // NOTE: We pass 'grado' (e.g., "1er Grado") as the 'nivel' parameter to find the correct rows.
        const res = await getInasistencias(mes, cargo, grado)
        if (res.success && res.data) {
            setRegistros(res.data)
        } else {
            console.error(res.error)
            setRegistros([])
        }
        setLoading(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            {/* Main Modal */}
            <div className={`bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all duration-200 ${selectedJustification ? 'scale-95 opacity-50 blur-[1px]' : 'scale-100 opacity-100'}`}>

                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Historial de Inasistencias</h2>
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
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wide">
                                {registros.length} Registros
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <span className="text-sm">Cargando registros...</span>
                        </div>
                    ) : registros.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <p className="text-sm font-medium">No hay inasistencias registradas.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3">Fecha</th>
                                        <th className="px-4 py-3">Estudiante</th>
                                        <th className="px-4 py-3 text-center">Just.</th>
                                        <th className="px-4 py-3 text-center">Motivo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {registros.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                                                {new Date(r.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {r.nombre} {r.apellido}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {r.justificada ? (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                                                        SÍ
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
                                                        NO
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {r.justificacion ? (
                                                    <button
                                                        onClick={() => setSelectedJustification(r.justificacion)}
                                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
                                                        title="Ver detalle de justificación"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            {/* Justification Detail Overlay */}
            {selectedJustification && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
                    {/* Backdrop for click-away */}
                    <div
                        className="absolute inset-0"
                        onClick={() => setSelectedJustification(null)}
                    ></div>

                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 relative z-10 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Detalle de Justificación
                            </h3>
                            <button
                                onClick={() => setSelectedJustification(null)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 max-h-[300px] overflow-y-auto">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {selectedJustification}
                            </p>
                        </div>
                        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedJustification(null)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
