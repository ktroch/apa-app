const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzT6TOfCsUIddAEizXKKrACH1iUcrWt26TYF-yNLiDiJ6YSnuHdqdHy9AKei011FIFbeg/exec'; 

async function intentarLogin() {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
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
        // Consultamos al script mediante GET para obtener una respuesta JSON directa y evitar líos de CORS en el login
        const urlConsulta = `${WEB_APP_URL}?action=login&user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`;
        const res = await fetch(urlConsulta);
        const data = await res.json();

        if (data.status === "success") {
            // IMPORTANTE: Guardamos con las mismas llaves que usa home.html
            sessionStorage.setItem('user_role', data.role); // Usamos 'role' como viene del script
            sessionStorage.setItem('user_name', user); // Usamos el ID de usuario como nombre temporal o puedes ajustar el script para enviar el nombre real
            
            if (document.getElementById('remember').checked) {
                localStorage.setItem('apa_session', JSON.stringify(data));
            }

            window.location.href = 'home.html'; 
        } else {
            errorMsg.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.innerText = "Entrar";
        }
    } catch (e) {
        console.error(e);
        errorMsg.innerText = "Error de conexión";
        errorMsg.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.innerText = "Entrar";
    }
}