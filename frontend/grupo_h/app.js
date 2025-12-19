
const studentsData = {
    "AG": {
        name: "Ana García",
        code: "20231001",
        grade: "0.7",
        status: "Pendiente revisión",
        history: [
            { date: "18 nov, 10:30 AM", text: "Se sugiere revisar la bibliografía del capítulo 3 para mejorar la argumentación téorica." }
        ]
    },
    "CL": {
        name: "Carlos López",
        code: "20231002",
        grade: "4.5",
        status: "Completado",
        history: [
            { date: "15 dic, 08:20 AM", text: "Excelente desempeño en la sustentación oral." },
            { date: "10 nov, 02:15 PM", text: "El trabajo escrito cumple con todas las normas APA." }
        ]
    },
    "MR": {
        name: "Maria Rodriguez",
        code: "20231003",
        grade: "3.8",
        status: "Completado",
        history: [
            { date: "12 nov, 11:00 AM", text: "Debe mejorar la ortografía en el segundo párrafo." }
        ]
    }
};

// Función principal para cambiar de estudiante
function loadStudent(id) {
    const student = studentsData[id];
    if (!student) return;

    // 1. Actualizar identidad (Nombre y Código)
    document.querySelector('.student-identity h2').innerText = student.name;
    document.querySelector('.student-identity span').innerText = `Código: ${student.code}`;
    document.querySelector('.student-identity .circle').innerText = id;

    // 2. Actualizar Nota Definitiva
    document.getElementById('displayGrade').innerText = student.grade;

    // 3. Limpiar y Cargar Historial
    const list = document.getElementById('historyList');
    list.innerHTML = ""; // Limpiar actual
    student.history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<strong>${item.date}</strong><p>${item.text}</p>`;
        list.appendChild(div);
    });

    // 4. Actualizar clase activa en la lista lateral
    document.querySelectorAll('.student-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// --- Funciones originales mantenidas ---

function notifyStudent() {
    alert("Notificación enviada con éxito al estudiante seleccionado.");
}

function saveComment() {
    const input = document.getElementById('commentInput');
    const list = document.getElementById('historyList');
    if (input.value.trim() === "") {
        alert("Escribe una retroalimentación antes de guardar.");
        return;
    }
    const now = new Date();
    const dateLabel = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<strong>${dateLabel}</strong><p>${input.value}</p>`;
    list.prepend(item);
    input.value = "";
}

function saveGrade() {
    const gradeInput = document.getElementById('newGrade');
    const gradeDisplay = document.getElementById('displayGrade');
    const valor = parseFloat(gradeInput.value);
    if (isNaN(valor) || valor < 0 || valor > 5) {
        alert("La nota debe ser un número entre 0.0 y 5.0");
        return;
    }
    gradeDisplay.innerText = valor.toFixed(1);
    gradeInput.value = ""; 
    alert("Nota actualizada con éxito.");
}