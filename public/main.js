async function checkHealth() {
    const resultDiv = document.getElementById('result');
    const statusDiv = document.getElementById('status');
    
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3>Health Check OK</h3>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        `;

        if (data) {
            statusDiv.innerHTML = "<strong>Status:</strong> Applikationen körs!"
        }
        
    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<h3>Fel: ${error.message}</h3>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const healthButton = document.querySelector('button');
    healthButton.addEventListener('click', checkHealth);
});
 