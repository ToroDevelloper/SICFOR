const studentsData = [
    { id: 1, initials: 'AG', name: 'Ana García', nota: 4.5, obs: 'Excelente trabajo' },
    { id: 2, initials: 'CL', name: 'Carlos López', nota: 2.8, obs: 'Faltó profundidad' },
    { id: 3, initials: 'MR', name: 'Maria Rodriguez', nota: 5.0, obs: 'Impecable' },
    { id: 4, initials: 'JP', name: 'Juan Perez', nota: 0, obs: '' }
];

function renderTable() {
    const tableBody = document.getElementById('studentsBody');
    tableBody.innerHTML = '';
    
    studentsData.forEach((student, index) => {
        let statusClass = '';
        let iconClass = 'fa-check-circle';

        if (student.nota === 0) {
            statusClass = 'status-fail-red'; 
            iconClass = 'fa-circle-xmark'; 
        } else if (student.nota < 3.0) {
            statusClass = 'status-warning'; 
            iconClass = 'fa-clock';
        } else {
            statusClass = 'status-pass'; 
            iconClass = 'fa-check-circle';
        }

        const notaStyle = (student.nota < 3.0) ? 'nota-baja' : '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div style="display:flex; align-items:center;">
                    <span class="user-avatar-circle" style="width:28px; height:28px; font-size:10px; margin-right:10px;">
                        ${student.initials}
                    </span>
                    ${student.name}
                </div>
            </td>
            <td>
                <input type="number" step="0.1" class="input-nota ${notaStyle}" 
                    value="${student.nota}" 
                    onchange="updateNota(${index}, this.value)">
            </td>
            <td>
                <input type="text" class="observation-input" 
                    value="${student.obs}" 
                    onchange="updateObs(${index}, this.value)">
            </td>
            <td style="text-align:center">
                <i class="fas ${iconClass} ${statusClass} status-icon"></i>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateNota(index, value) {
    let n = parseFloat(value);
    if (n > 5) n = 5;
    if (n < 0 || isNaN(n)) n = 0;
    studentsData[index].nota = n;
    renderTable();
}

function updateObs(index, value) {
    studentsData[index].obs = value;
}

document.getElementById('btnGuardar').addEventListener('click', () => {
    alert("¡Cambios guardados exitosamente!");
});

renderTable();