
'use client'

import { useState, useEffect } from 'react'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (nivel: string, grado: string) => void;
    existingGrades: { nivel: string, grado: string }[];
}

const NIVELES = ['Inicial', 'Primaria', 'Media General'] as const;

const GRADOS_POR_NIVEL: Record<string, string[]> = {
    'Inicial': ['Maternal', 'Preescolar'],
    'Primaria': ['1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado'],
    'Media General': ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año']
};

export function AddGradeModal({ isOpen, onClose, onCreate, existingGrades }: Props) {
    const [nivel, setNivel] = useState<string>(NIVELES[0]);
    const [grado, setGrado] = useState<string>('');
    const [options, setOptions] = useState<string[]>([]);

    // Actualizar opciones cuando cambia el nivel
    useEffect(() => {
        const nuevosGrados = GRADOS_POR_NIVEL[nivel] || [];
        setOptions(nuevosGrados);
        // Seleccionar el primero por defecto
        if (nuevosGrados.length > 0) {
            setGrado(nuevosGrados[0]);
        } else {
            setGrado('');
        }
    }, [nivel]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (!nivel || !grado) return;

        // Verificar duplicados (opcional pero recomendado)
        const exists = existingGrades.some(g => g.nivel === nivel && g.grado === grado);
        if (exists) {
            alert('¡Este grado ya existe en la configuración!');
            return;
        }

        onCreate(nivel, grado);
        onClose();
        // Reset (opcional, aunque el componente se desmonta o se oculta)
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all scale-100">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Agregar Nuevo Grado</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Nivel Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nivel Educativo
                        </label>
                        <select
                            value={nivel}
                            onChange={(e) => setNivel(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#007a58] focus:border-transparent transition-all"
                        >
                            {NIVELES.map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    {/* Grado Selector (Dependent) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Grado / Año
                        </label>
                        <select
                            value={grado}
                            onChange={(e) => setGrado(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#007a58] focus:border-transparent transition-all disabled:opacity-50"
                            disabled={options.length === 0}
                        >
                            {options.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 text-white bg-[#007a58] font-bold rounded-lg hover:bg-[#006045] shadow-md hover:shadow-lg transition-all transform active:scale-95"
                        >
                            Crear Grado
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
