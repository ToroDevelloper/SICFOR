export const getPrioridadClase = (prioridad) => {
  const clases = {
    'Baja': 'prioridad-baja',
    'Media': 'prioridad-media',
    'Alta': 'prioridad-alta',
    'Urgente': 'prioridad-urgente'
  }
  return clases[prioridad] || ''
}

export const getEstadoClase = (estado) => {
  const clases = {
    'Abierto': 'estado-abierto',
    'En proceso': 'estado-proceso',
    'Cerrado': 'estado-cerrado'
  }
  return clases[estado] || ''
}

export const formatearFecha = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

export const formatearFechaHora = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getAccionClase = (accion) => {
  const clases = {
    'Creado': 'accion-creado',
    'Editado': 'accion-editado',
    'Cerrado': 'accion-cerrado',
    'Reabierto': 'accion-reabierto',
    'Respuesta agregada': 'accion-respuesta',
    'Respuesta editada': 'accion-respuesta-edit'
  }
  return clases[accion] || 'accion-default'
}

export const getAccionIcono = (accion) => {
  const iconos = {
    'Creado': '✨',
    'Editado': '✏️',
    'Cerrado': '🔒',
    'Reabierto': '🔓',
    'Respuesta agregada': '💬',
    'Respuesta editada': '📝'
  }
  return iconos[accion] || '📌'
}
