JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const septicForm = document.getElementById('septicForm');

    septicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const payload = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            urgency: document.getElementById('urgency').value
        };

        alert(`Emergency dispatch notice received for ${payload.location.toUpperCase()}. A technician is reviewing your request.`);
        septicForm.reset();
    });
});