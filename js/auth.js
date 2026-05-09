const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyEw0xiPaC8TXJISDX_ogiPRCjwVvumqNVQJEUG13Vt6Okr84WhZ2WEqiKDmLdfxw6mag/exec'; 

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
        const urlConsulta = `${WEB_APP_URL}?action=login&user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`;
        const res = await fetch(urlConsulta);
        const data = await res.json();

        if (data.status === "success") {
            // Guardamos el NOMBRE real y el ROL exacto
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
        errorMsg.innerText = "Error de conexión";
        errorMsg.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.innerText = "Entrar";
    }
}