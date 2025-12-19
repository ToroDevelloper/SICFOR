document.addEventListener('DOMContentLoaded', () => {
    console.log('SICFOR Dashboard Loaded');

    // Añadir efecto de fade-in a las tarjetas
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Verificación simple de disponibilidad de enlaces (opcional, solo visual en consola)
    const links = document.querySelectorAll('.card');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log(`Navegando a: ${link.getAttribute('href')}`);
            // Aquí se podría añadir lógica para manejar errores 404 si fuera una SPA
        });
    });
});