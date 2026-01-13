"use client"

import { useState } from "react"
import { resetSchoolPeriod } from "@/actions/admin-actions"
import { toast } from "sonner"

interface ResetPeriodModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ResetPeriodModal({ isOpen, onClose }: ResetPeriodModalProps) {
    const [confirmText, setConfirmText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()

        if (confirmText !== "REINICIAR") {
            toast.error("Por favor escribe REINICIAR para confirmar")
            return
        }

        setIsSubmitting(true)
        const res = await resetSchoolPeriod()

        if (res.success) {
            toast.success("Periodo escolar reiniciado correctamente")
            onClose()
            setConfirmText("")
        } else {
            toast.error("Error al reiniciar: " + res.error)
        }
        setIsSubmitting(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 p-6 border-l-4 border-red-500">

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-full text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">¿Reiniciar Periodo Escolar?</h2>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Esta acción es <span className="font-bold text-red-600">DESTRUCTIVA</span> y <span className="font-bold text-red-600">IRREVERSIBLE</span>.
                </p>
                <div className="bg-red-50 p-3 rounded-lg text-xs text-red-700 space-y-1 mb-4">
                    <p>✅ Se borrarán todas las inasistencias diarias.</p>
                    <p>✅ Se borrarán todos los registros mensuales de asistencia.</p>
                    <p className="font-semibold pt-1 text-gray-700">❌ NO se borrará la configuración de grados ni personal.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Escribe "REINICIAR" para confirmar:</label>
                        <input
                            type="text"
                            required
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none placeholder:uppercase text-gray-900"
                            placeholder="REINICIAR"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || confirmText !== "REINICIAR"}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            {isSubmitting ? "Reiniciando..." : "Sí, Reiniciar Todo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
