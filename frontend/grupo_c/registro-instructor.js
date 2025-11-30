// Manejo de preview de foto
const inputFoto = document.getElementById('inputFoto');
const fotoPreview = document.getElementById('fotoPreview');

inputFoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            fotoPreview.innerHTML = `<img src="${event.target.result}" alt="Preview de foto">`;
        };
        reader.readAsDataURL(file);
    }
});

// Manejo de etiquetas/tags
const inputAreas = document.getElementById('areasExpertise');
const etiquetasContainer = document.getElementById('etiquetasContainer');
const etiquetas = [];

inputAreas.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const valor = inputAreas.value.trim();
        
        if (valor && !etiquetas.includes(valor)) {
            etiquetas.push(valor);
            agregarEtiqueta(valor);
            inputAreas.value = '';
        }
    }
});

function agregarEtiqueta(texto) {
    const etiqueta = document.createElement('div');
    etiqueta.className = 'etiqueta';
    etiqueta.setAttribute('role', 'listitem');
    etiqueta.innerHTML = `
        ${texto}
        <button type="button" aria-label="Eliminar ${texto}" onclick="eliminarEtiqueta(this, '${texto}')">&times;</button>
    `;
    etiquetasContainer.appendChild(etiqueta);
}

function eliminarEtiqueta(boton, texto) {
    const index = etiquetas.indexOf(texto);
    if (index > -1) {
        etiquetas.splice(index, 1);
    }
    boton.parentElement.remove();
}

// Manejo del formulario
const form = document.getElementById('formRegistroInstructor');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';

    // Recopilar datos del formulario
    const formData = new FormData(form);
    const datos = {
        nombre: formData.get('nombre'),
        apellidos: formData.get('apellidos'),
        documentoId: formData.get('documentoId'),
        fechaNacimiento: formData.get('fechaNacimiento'),
        tituloAcademico: formData.get('tituloAcademico'),
        especialidad: formData.get('especialidad'),
        anosExperiencia: formData.get('anosExperiencia'),
        areasExpertise: etiquetas,
        resumen: formData.get('resumen'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        linkedin: formData.get('linkedin'),
        direccion: formData.get('direccion'),
        estadoInicial: formData.get('estadoInicial')
    };

    try {
        // Aquí iría la llamada al backend
        console.log('Datos a guardar:', datos);
        
        // Simular guardado
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Instructor guardado exitosamente');
        form.reset();
        fotoPreview.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
        `;
        etiquetasContainer.innerHTML = '';
        etiquetas.length = 0;
        
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar el instructor. Por favor, intente nuevamente.');
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar Instructor';
    }
});

btnCancelar.addEventListener('click', () => {
    if (confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.')) {
        window.location.href = 'index.html';
    }
});
