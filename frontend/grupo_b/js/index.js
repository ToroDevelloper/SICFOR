const API_URL = 'http://localhost:8080/estudiantes';

// Función auxiliar para manejar respuestas
async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text(); // captura el error real (HTML o mensaje)
    throw new Error(text);
  }
  return res.json();
}

// 1. Obtener lista
async function cargarEstudiantes() {
  const res = await fetch(API_URL);
  return handleResponse(res);
}

// 2. Buscar por identificación
async function buscarPorIdentificacion(numero) {
  const res = await fetch(`${API_URL}/buscar?numero_identificacion=${numero}`);
  return handleResponse(res);
}

// 3. Obtener por ID
async function obtenerEstudiante(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return handleResponse(res);
}

// 4. Crear estudiante
async function crearEstudiante(estudiante) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(estudiante)
  });
  return handleResponse(res);
}

// 5. Subir foto
async function subirFoto(id, file) {
  const formData = new FormData();
  formData.append('foto', file);

  const res = await fetch(`${API_URL}/${id}/foto`, {
    method: 'POST',
    body: formData
  });
  return handleResponse(res);
}

// 6. Actualizar estudiante
async function actualizarEstudiante(id, estudiante) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(estudiante)
  });
  return handleResponse(res);
}

// 7. Eliminar estudiante
async function eliminarEstudiante(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}