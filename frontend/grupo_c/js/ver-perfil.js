// Obtener instructor por ID desde la API
async function fetchInstructorById(id) {
	try {
		const response = await fetch(`/api/instructores/${id}`);
		if (!response.ok) {
			throw new Error(`Error HTTP: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error al obtener instructor:', error);
		throw error;
	}
}

// Cambiar estado del instructor (solo actualiza el campo estado)
async function cambiarEstadoInstructor(id, nuevoEstado) {
	try {
		const response = await fetch(`/api/instructores/${id}/estado`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ estado: nuevoEstado })
		});
		
		if (!response.ok) {
			throw new Error(`Error HTTP: ${response.status}`);
		}
		
		return await response.json();
	} catch (error) {
		console.error('Error al cambiar estado del instructor:', error);
		throw error;
	}
}

const instructorId = new URLSearchParams(window.location.search).get("instructorId");
const idConvertido = parseInt(instructorId, 10);

// Cargar y mostrar datos del instructor
document.addEventListener("DOMContentLoaded", async () => {
	const contenedorPerfil = document.querySelector(".container");
	
	if (!contenedorPerfil) {
		console.error("No se encontró el contenedor principal");
		return;
	}
	
	try {
		// Mostrar loader mientras carga
		const profileHeader = contenedorPerfil.querySelector(".profile-header");
		const contentWrapper = contenedorPerfil.querySelector(".content-wrapper");
		
		if (profileHeader) {
			profileHeader.innerHTML = `
				<div style="text-align: center; padding: 40px;">
					<div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
					<p style="margin-top: 20px; color: #6c757d;">Cargando perfil...</p>
				</div>
			`;
		}

		const instructor = await fetchInstructorById(idConvertido);
		
		poblarDatos(instructor);
	} catch (error) {
		const profileHeader = contenedorPerfil.querySelector(".profile-header");
		const contentWrapper = contenedorPerfil.querySelector(".content-wrapper");
		
		if (profileHeader) profileHeader.innerHTML = '';
		if (contentWrapper) {
			contentWrapper.innerHTML = `
				<div style="text-align: center; padding: 40px;">
					<i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
					<p style="color: #e74c3c; font-weight: bold;">Error al cargar el perfil</p>
					<p style="color: #6c757d; margin-top: 10px;">Por favor, verifica que el servidor esté ejecutándose</p>
					<button onclick="location.href='index.html'" style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
						Volver al inicio
					</button>
				</div>
			`;
		}
	}
});

function poblarDatos(datos) {
	// Elementos del DOM
	const encabezadoPerfil = document.querySelector(".profile-header");
	
	// Debug: Ver qué datos llegan de la API
	console.log('Datos del instructor recibidos:', datos);

	// Limpiar header y agregar foto de perfil
	encabezadoPerfil.innerHTML = '';
	
	const fotoPerfil = document.createElement("img");
	fotoPerfil.src = datos.foto_uri;
	fotoPerfil.alt = `${datos.nombres} ${datos.apellidos}`;
	fotoPerfil.className = "profile-image";
	encabezadoPerfil.appendChild(fotoPerfil);

	// Nombre completo
	const informacionPerfil = document.createElement("article");
	informacionPerfil.className = "profile-info";
	informacionPerfil.innerHTML = `
		<h1>${datos.nombres} ${datos.apellidos}</h1>
		<p class="title">${datos.especialidad}</p>
		<span class="status-badge status-${datos.estado}">${datos.estado.charAt(0).toUpperCase() + datos.estado.slice(1)}</span>
	`;
	encabezadoPerfil.appendChild(informacionPerfil);

	// Biografía
	const cardBiografia = document.getElementById("card-biografia");
	if (cardBiografia) {
		cardBiografia.innerHTML = `
			<h2>RESUMEN PROFESIONAL</h2>
			<p>${datos.resumen}</p>
		`;
	}

	// Áreas de Experiencia
	const cardExperiencia = document.getElementById("card-experiencia");
	if (cardExperiencia) {
		let areasHTML = '';
		
		// La API devuelve 'habilidades' como array de objetos
		if (datos.habilidades && Array.isArray(datos.habilidades)) {
			areasHTML = datos.habilidades
				.filter(habilidad => habilidad && habilidad.habilidad) // Filtrar valores null
				.map(habilidad => `<span class="tag">${habilidad.habilidad}</span>`)
				.join("");
		} 
		// Fallback: si viene como string (datos de prueba)
		else if (datos.areas_experiencia && typeof datos.areas_experiencia === 'string') {
			areasHTML = datos.areas_experiencia
				.split(",")
				.map(area => `<span class="tag">${area.trim()}</span>`)
				.join("");
		}
		
		cardExperiencia.innerHTML = `
			<h2>ÁREAS DE EXPERIENCIA</h2>
			<div class="tags">
				${areasHTML || '<p style="color: #999;">No hay áreas de experiencia registradas</p>'}
			</div>
		`;
	}

	// Información de contacto
	const itemContacto = document.querySelectorAll(".contact-item");
	if (itemContacto.length >= 4) {
		itemContacto[0].innerHTML += `<span>${datos.email}</span>`;
		itemContacto[1].innerHTML += `<span>${datos.telefono}</span>`;
		itemContacto[2].innerHTML += `<a target="_blank" href="${datos.linkedin}" class="link">${datos.linkedin || 'No disponible'}</a>`;
		itemContacto[3].innerHTML += `<span>${datos.direccion}</span>`;
	}

	// Datos personales adicionales
	const detallesPersonales = document.querySelectorAll(".detail-item");
	if (detallesPersonales.length >= 3) {
		detallesPersonales[0].innerHTML = `<span class="label">ID</span><span class="value">${datos.id_instructor}</span>`;
		detallesPersonales[1].innerHTML = `<span class="label">Fecha Nacimiento</span><span class="value">${datos.fecha_nacimiento}</span>`;
		detallesPersonales[2].innerHTML = `<span class="label">Experiencia</span><span class="value">${datos.anos_experiencia} años</span>`;
	}
	
	// Configurar botón Editar después de cargar los datos
	const botonEditar = document.getElementById('btn-editar');
	if (botonEditar) {
		botonEditar.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = `form-instructor.html?instructorId=${instructorId}`;
		});
	}

	const botonDesactivar = document.getElementById('btn-desactivar');
	if (botonDesactivar) {
		// Configurar el botón según el estado actual
		const estaActivo = datos.estado === 'activo';
		botonDesactivar.textContent = estaActivo ? 'Desactivar' : 'Activar';
		botonDesactivar.className = estaActivo ? 'btn btn-danger' : 'btn btn-success';
		
		botonDesactivar.addEventListener('click', async (e) => {
			e.preventDefault();
			
			const nuevoEstado = estaActivo ? 'inactivo' : 'activo';
			const accion = estaActivo ? 'desactivar' : 'activar';
			
			// Confirmar la acción
			if (!confirm(`¿Estás seguro de que deseas ${accion} este instructor?`)) {
				return;
			}
			
			try {
				// Mostrar loading en el botón
				const textoOriginal = botonDesactivar.textContent;
				botonDesactivar.disabled = true;
				botonDesactivar.textContent = `${accion.charAt(0).toUpperCase() + accion.slice(1)}ando...`;
				
				// Cambiar estado
				await cambiarEstadoInstructor(idConvertido, nuevoEstado);
				
				// Mostrar mensaje de éxito
				alert(`Instructor ${accion}do correctamente`);
				
				// Recargar la página para mostrar el estado actualizado
				location.reload();
			} catch (error) {
				// Restaurar botón y mostrar error
				botonDesactivar.disabled = false;
				botonDesactivar.textContent = textoOriginal;
				alert(`Error al ${accion} el instructor. Por favor, intenta nuevamente.`);
				console.error('Error:', error);
			}
		});
	}
}
