// Verificar formulario si edit o nuevo
const urlParams = new URLSearchParams(window.location.search);
const instructorId = parseInt(urlParams.get("instructorId"), 10);
const esEdicion = instructorId !== null;

const formulario = document.getElementById('formRegistroInstructor');

// Para preview de foto-perfil
const inputFoto = document.getElementById('inputFotoUri');
const fotoPreview = document.getElementById('fotoPreview');

// Para manejo de soporte digital
const inputSoporte = document.getElementById('hojaVida');
const soporteLabel = document.getElementById('soporteLabel');
const soporteFileName = document.getElementById('soporteFileName');
const uploadText = soporteLabel.querySelector('.upload-text');
const svg = soporteLabel.querySelector('svg');

// Función para obtener instructor por ID desde la API
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

async function init() {
    if (esEdicion && instructorId) {
        try {
            const instructorEdit = await fetchInstructorById(instructorId);
            await poblarFormulario(formulario, instructorEdit);
        } catch (error) {
            alert('Error al cargar los datos del instructor. Por favor, verifica que el servidor esté ejecutándose.');
            console.error(`No se encontró el instructor con ID: ${instructorId}`);
        }
    }
}

async function poblarFormulario(formulario, datos) {
    // Poblar campos del formulario
    console.log(datos);
    
    // Manejo de foto
    fotoPreview.innerHTML = `<img src="${datos.foto_uri}" alt="Preview de foto">`;

    formulario.estado.value = datos.estado;
    formulario.nombres.value = datos.nombres;
    formulario.apellidos.value = datos.apellidos;
    formulario.email.value = datos.email;
    formulario.telefono.value = datos.telefono;
    formulario.documento_identidad.value = datos.documento_identidad;
    formulario.fechaNacimiento.value = datos.fecha_nacimiento;

    uploadText.style.display = 'none';
    svg.style.display = 'none';
    soporteFileName.style.display = 'block';
    soporteFileName.textContent = `📄 ${datos.hoja_vida_uri}`;
    soporteLabel.classList.add('file-selected');

    formulario.tituloAcademico.value = datos.titulo_academico;
    formulario.especialidad.value = datos.especialidad;
    formulario.anosExperiencia.value = datos.anos_experiencia;
    formulario.resumen.value = datos.resumen;
    
    // Convertir array de habilidades a string separado por comas
    if (datos.habilidades && Array.isArray(datos.habilidades)) {
        const habilidadesString = datos.habilidades
            .map(h => h.habilidad)
            .filter(h => h)
            .join(', ');
        formulario.areasExperiencia.value = habilidadesString;
    }
    
    formulario.linkedin.value = datos.linkedin;
    formulario.direccion.value = datos.direccion;
}


// Manejo de preview de foto
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

// Manejo de soporte digital - mostrar nombre de archivo
inputSoporte.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Ocultar el texto original y mostrar el nombre del archivo
        uploadText.style.display = 'none';
        svg.style.display = 'none';
        soporteFileName.style.display = 'block';
        soporteFileName.textContent = `📄 ${file.name}`;
        soporteLabel.classList.add('file-selected');
    }
});

// Manejo de envio de formulario
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(formulario);
    const values = Object.fromEntries(formData.entries());
    console.log(values);
    
    // Preparar datos para enviar al backend
    const instructorData = {
        estado: values.estado,
        nombres: values.nombres,
        apellidos: values.apellidos,
        email: values.email,
        telefono: values.telefono,
        documento_identidad: values.documento_identidad,
        fecha_nacimiento: values.fecha_nacimiento,
        foto_uri: values.inputFotoUri || `https://ui-avatars.com/api/?name=${encodeURIComponent(values.nombres)}+${encodeURIComponent(values.apellidos)}&background=4a90e2&color=fff`,
        hoja_vida_uri: values.hoja_vida_uri ? values.hoja_vida_uri.name : 'cv-documento.pdf',
        titulo_academico: values.titulo_academico,
        especialidad: values.especialidad,
        anos_experiencia: parseInt(values.anos_experiencia),
        resumen: values.resumen,
        habilidades: values.areas_experiencia 
            ? values.areas_experiencia.split(',').map(h => h.trim()).filter(h => h)
            : [],
        linkedin: values.linkedin,
        direccion: values.direccion
    };

    console.log(instructorData);
    

    try {
        let response;
        
        if (esEdicion && instructorId) {
            // Actualizar instructor existente (PUT)
            response = await fetch(`/api/instructores/${instructorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(instructorData)
            });
        } else {
            // Crear nuevo instructor (POST)
            response = await fetch('/api/instructores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(instructorData)
            });
        }

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('Instructor guardado:', result);
        
        alert(esEdicion ? '¡Instructor actualizado exitosamente!' : '¡Instructor creado exitosamente!');
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Error al guardar instructor:', error);
        alert('Error al guardar el instructor. Por favor, verifica que el servidor esté ejecutándose.');
    }
});

// Manejo de cancelar
const botonCancelar = document.getElementById('btnCancelar');
const botonVolver = document.getElementById('btnVolver');

botonCancelar.addEventListener('click', manejarRedirectHome);
botonVolver.addEventListener('click', manejarRedirectHome);

function manejarRedirectHome(e) {
    e.preventDefault();
    window.location.href = 'index.html';
}

init();
