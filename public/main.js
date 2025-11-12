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

async function loadUsers() {
    const usersListDiv = document.getElementById('users-list');
    
    usersListDiv.innerHTML = '<div class="loading">Laddar användare...</div>';
    
    try {
        const response = await fetch('/api/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        
        if (users.length === 0) {
            usersListDiv.innerHTML = '<div class="loading">Inga användare hittades</div>';
            return;
        }
        
        const userCards = users.map(user => `
            <div class="user-card">
                <h3 class="user-name">${user.name}</h3>
                <p class="user-email">${user.email}</p>
                <div class="user-details">
                    <span class="user-age">${user.age} år</span>
                    <span class="user-role role-${user.role}">${user.role}</span>
                </div>
            </div>
        `).join('');
        
        usersListDiv.innerHTML = userCards;
        
    } catch (error) {
        console.error('Error loading users:', error);
        usersListDiv.innerHTML = `
            <div class="error">
                Fel vid laddning av användare: ${error.message}
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const healthButton = document.querySelector('button');
    healthButton.addEventListener('click', checkHealth);
    
    const loadUsersButton = document.getElementById('load-users-btn');
    loadUsersButton.addEventListener('click', loadUsers);
});
 