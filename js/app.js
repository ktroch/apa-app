document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');

    // Protección de ruta: si no hay sesión, regresa al login
    if (!window.location.href.includes('index.html') && !sessionStorage.getItem('user_role')) {
    window.location.href = 'index.html';
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', intentarLogin);
    }

    // Configuración básica de Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
    }
});