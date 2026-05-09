const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyEw0xiPaC8TXJISDX_ogiPRCjwVvumqNVQJEUG13Vt6Okr84WhZ2WEqiKDmLdfxw6mag/exec'; 

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

    // Estado visual de carga
    loginBtn.disabled = true;
    loginBtn.innerText = "Verificando...";
    errorMsg.style.display = 'none';

    try {
        // Usamos GET para el login para recibir la respuesta JSON de forma segura
        const urlConsulta = `${WEB_APP_URL}?action=login&user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`;
        const res = await fetch(urlConsulta);
        
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        
        const data = await res.json();

        if (data.status === "success") {
            // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
            // Guardamos el NOMBRE real (ej: "Kevin Troch") y el ROL (ej: "Admin")
            sessionStorage.setItem('user_role', data.role); 
            sessionStorage.setItem('user_name', data.nombre); 
            
            // Si el usuario marcó "Recordarme", guardamos en LocalStorage
            if (document.getElementById('remember').checked) {
                localStorage.setItem('apa_session', JSON.stringify({
                    role: data.role,
                    nombre: data.nombre,
                    user: user // Guardamos el user id solo para autorellenar si fuera necesario
                }));
            }

            // Redirección al Home
            window.location.href = 'home.html'; 
        } else {
            errorMsg.innerText = "Usuario o contraseña incorrectos";
            errorMsg.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.innerText = "Entrar";
        }
    } catch (e) {
        console.error("Error de Login:", e);
        errorMsg.innerText = "Error de conexión con el servidor";
        errorMsg.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.innerText = "Entrar";
    }
}

// Escuchar el evento click del botón (asegúrate que el ID en index.html sea 'login-btn')
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('login-btn');
    if (btn) {
        btn.addEventListener('click', intentarLogin);
    }
    
    // Opcional: Permitir entrar con la tecla "Enter"
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') intentarLogin();
    });
});