
'use client'

import { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (tipo: string, niveles: string[]) => void;
    existingPersonal: { tipo: string; nivel: string }[];
}

const TIPOS = ['Docente', 'Administrativo', 'Obrero', 'Madre de la patria'];
const NIVELES = ['Inicial', 'Primaria', 'Media General'];

export function AddPersonalModal({ isOpen, onClose, onCreate, existingPersonal }: Props) {
    const [tipo, setTipo] = useState<string>(TIPOS[0]);
    const [selectedNiveles, setSelectedNiveles] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleNivel = (nivel: string) => {
        setSelectedNiveles(prev =>
            prev.includes(nivel)
                ? prev.filter(n => n !== nivel)
                : [...prev, nivel]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!tipo || selectedNiveles.length === 0) return;

        // Validar duplicados
        const duplicados = selectedNiveles.filter(n =>
            existingPersonal.some(p => p.tipo === tipo && p.nivel === n)
        );

        if (duplicados.length > 0) {
            alert(`¡Ya existen registros para ${tipo} en: ${duplicados.join(', ')}!`);
            return;
        }

        onCreate(tipo, selectedNiveles);
        onClose();
        // Reset state
        setTipo(TIPOS[0]);
        setSelectedNiveles([]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all scale-100">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Agregar Personal</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tipo de Personal
                        </label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#007a58] focus:border-transparent transition-all"
                        >
                            {TIPOS.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Nivel Educativo / Área (Selección Múltiple)
                        </label>
                        <div className="space-y-3">
                            {NIVELES.map(nivel => (
                                <label
                                    key={nivel}
                                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedNiveles.includes(nivel)
                                            ? 'border-[#007a58] bg-green-50'
                                            : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedNiveles.includes(nivel)}
                                        onChange={() => toggleNivel(nivel)}
                                        className="w-5 h-5 text-[#007a58] rounded focus:ring-[#007a58] border-gray-300"
                                    />
                                    <span className={`ml-3 font-medium ${selectedNiveles.includes(nivel) ? 'text-[#007a58]' : 'text-gray-600'
                                        }`}>
                                        {nivel}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Selecciona uno o más niveles para crear los registros correspondientes.
                        </p>
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
                            disabled={selectedNiveles.length === 0}
                            className="flex-1 px-4 py-3 text-white bg-[#007a58] font-bold rounded-lg hover:bg-[#006045] shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Crear Registros {selectedNiveles.length > 0 && `(${selectedNiveles.length})`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
