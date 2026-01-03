import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
    // 1. Fetch data from DB
    const allMatricula = await prisma.matriculaConfig.findMany()
    const allPersonal = await prisma.personalConfig.findMany()

    // 2. Initialize aggregators
    const stats: Record<string, { varones: number, hembras: number }> = {
        'Inicial': { varones: 0, hembras: 0 },
        'Primaria': { varones: 0, hembras: 0 },
        'Media General': { varones: 0, hembras: 0 },
    }

    // 3. Aggregate data
    allMatricula.forEach(m => {
        // Normalize level string just in case, though it should match strict keys
        const formattedLevel = m.nivel as string;

        if (stats[formattedLevel]) {
            stats[formattedLevel].varones += m.cantidadVarones || 0
            stats[formattedLevel].hembras += m.cantidadHembras || 0
        }
    })

    // 4. Format for display (Ensuring Order: Inicial -> Primaria -> Media General)
    const matricula = [
        { nivel: "Inicial", ...stats['Inicial'] },
        { nivel: "Primaria", ...stats['Primaria'] },
        { nivel: "Media General", ...stats['Media General'] },
    ]

    // Calculate Matricula Totals
    const totalMatriculaVarones = matricula.reduce((acc, curr) => acc + curr.varones, 0);
    const totalMatriculaHembras = matricula.reduce((acc, curr) => acc + curr.hembras, 0);
    const totalMatriculaGeneral = totalMatriculaVarones + totalMatriculaHembras;

    return (
        <div className="w-full">

            {/* TARJETA BLANCA PRINCIPAL */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Matrícula General
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th className="py-3 pl-2">Nivel Educativo</th>
                                <th className="py-3 text-center">Varones</th>
                                <th className="py-3 text-center">Hembras</th>
                                <th className="py-3 text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                            {matricula.map((item) => (
                                <tr key={item.nivel} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 pl-2 font-medium text-gray-900">{item.nivel}</td>
                                    <td className="py-4 text-center">{item.varones}</td>
                                    <td className="py-4 text-center">{item.hembras}</td>
                                    <td className="py-4 text-center font-bold text-gray-900">
                                        {item.varones + item.hembras}
                                    </td>
                                </tr>
                            ))}
                            {/* Row Total */}
                            <tr className="border-t-2 border-gray-100 font-bold bg-gray-50/50">
                                <td className="py-4 pl-2 text-[#007a58]">TOTAL</td>
                                <td className="py-4 text-center text-[#007a58]">{totalMatriculaVarones}</td>
                                <td className="py-4 text-center text-[#007a58]">{totalMatriculaHembras}</td>
                                <td className="py-4 text-center text-[#007a58]">{totalMatriculaGeneral}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Tablas de Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {['Docente', 'Administrativo', 'Obrero', 'Madre de la patria'].map((tipo) => {
                    const tipoData = allPersonal.filter(p => p.tipo === tipo);

                    const rows = ['Inicial', 'Primaria', 'Media General'].map(nivel => {
                        const match = tipoData.find(p => p.nivel === nivel);
                        return {
                            nivel,
                            varones: match?.cantidadVarones || 0,
                            hembras: match?.cantidadHembras || 0
                        }
                    });

                    return (
                        <div key={tipo} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">{tipo}s</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <th className="py-2 pl-1">Nivel</th>
                                            <th className="py-2 text-center">V</th>
                                            <th className="py-2 text-center">H</th>
                                            <th className="py-2 text-center">T</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                                        {rows.map((row) => (
                                            <tr key={row.nivel}>
                                                <td className="py-3 pl-1 font-medium">{row.nivel}</td>
                                                <td className="py-3 text-center text-gray-500">{row.varones}</td>
                                                <td className="py-3 text-center text-gray-500">{row.hembras}</td>
                                                <td className="py-3 text-center font-bold text-gray-900">{row.varones + row.hembras}</td>
                                            </tr>
                                        ))}
                                        {/* Row Total Personal */}
                                        <tr className="border-t-2 border-gray-100 font-bold bg-gray-50/50 text-sm">
                                            <td className="py-3 pl-1 text-[#007a58]">TOTAL</td>
                                            <td className="py-3 text-center text-[#007a58]">
                                                {rows.reduce((acc, curr) => acc + curr.varones, 0)}
                                            </td>
                                            <td className="py-3 text-center text-[#007a58]">
                                                {rows.reduce((acc, curr) => acc + curr.hembras, 0)}
                                            </td>
                                            <td className="py-3 text-center text-[#007a58]">
                                                {rows.reduce((acc, curr) => acc + curr.varones + curr.hembras, 0)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
