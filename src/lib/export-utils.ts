export function generateAndDownloadCSV(
    filename: string,
    reportTitle: string,
    period: string,
    headers: string[],
    dataRows: (string | number)[][],
    totalsRow: (string | number)[]
) {
    const titleRows = [
        ["UNIDAD EDUCATIVA ANDRÉS ELOY BLANCO"],
        [reportTitle],
        [`PERIODO: ${period}`],
        [`FECHA DE EMISIÓN: ${new Date().toLocaleDateString("es-ES")}`],
        []
    ];

    const csvContent = "\uFEFF" + [
        ...titleRows,
        headers,
        ...dataRows,
        [],
        totalsRow
    ].map(r => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
