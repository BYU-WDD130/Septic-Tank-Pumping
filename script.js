
document.addEventListener('DOMContentLoaded', () => {
    const septicForm = document.getElementById('septicForm');

    if (septicForm) {
        septicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const cityField = document.getElementById('cityLocation') || document.getElementById('location');
            const locationValue = cityField ? cityField.value : 'Utah Service Area';

            const payload = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                location: locationValue,
                urgency: document.getElementById('urgency') ? document.getElementById('urgency').value : 'routine',
                timestamp: new Date().toISOString()
            };

            alert(`Emergency dispatch notice received for ${payload.location.toUpperCase()}. A technician is reviewing your request.`);
            septicForm.reset();
        });
    }

    // Registro del Service Worker para optimización PWA y carga rápida
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((reg) => console.log('Service Worker registrado con éxito:', reg.scope))
                .catch((err) => console.log('Error al registrar el Service Worker:', err));
        });
    }
});