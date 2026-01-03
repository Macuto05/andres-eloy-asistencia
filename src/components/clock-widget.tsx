
'use client'

import { useState, useEffect } from 'react'

export function ClockWidget() {
    const [time, setTime] = useState('')

    useEffect(() => {
        // Función para actualizar la hora
        const updateTime = () => {
            const now = new Date()
            setTime(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }))
        }

        // Primera ejecución
        updateTime()

        // Actualizar cada minuto
        const interval = setInterval(updateTime, 1000 * 60)

        return () => clearInterval(interval)
    }, [])

    // Evitar hidratación incorrecta mostrando nada hasta montar
    if (!time) return null

    return <span>{time}</span>
}
