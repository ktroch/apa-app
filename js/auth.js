const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzK8xu3o1Y4gE6NovpF9oJ6EaIMIK224KSbUX75PDOG8i0SLLYonZKTgEWm_e4TJDStdw/exec'; 

async function intentarLogin() {
    const user = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();
    const errorMsg = document.getElementById('error-msg');
    const loginBtn = document.getElementById('login-btn');

    if (!user || !pass) {
        errorMsg.innerText = "Por favor, completa todos los campos";
        errorMsg.style.display = 'block';
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerText = "Verificando...";
    errorMsg.style.display = 'none';

    try {
        const urlConsulta = `${WEB_APP_URL}?action=login&user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`;
        const res = await fetch(urlConsulta);
        const data = await res.json();

        if (data.status === "success") {
            // Guardamos los datos recibidos del servidor
            sessionStorage.setItem('user_role', data.role); 
            sessionStorage.setItem('user_name', data.nombre); 
            
            if (document.getElementById('remember').checked) {
                localStorage.setItem('apa_session', JSON.stringify(data));
            }
            window.location.href = 'home.html'; 
        } else {
            errorMsg.innerText = "Usuario o contraseña incorrectos";
            errorMsg.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.innerText = "Entrar";
        }
    } catch (e) {
        console.error(e);
        errorMsg.innerText = "Error de conexión con el servidor";
        errorMsg.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.innerText = "Entrar";
    }
}