const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw-EldYeBB0kR8BzEZAmP0qMZcloEB6WwHgBnX7iGFiNAvrQf8IgVVqf9IgcujYK-pSVw/exec'; // La que termina en /exec

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

    // Estética de carga en el botón
    loginBtn.disabled = true;
    loginBtn.innerText = "Verificando...";
    errorMsg.style.display = 'none';

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Importante para Google Scripts
            body: JSON.stringify({
                action: 'login',
                user: user,
                pass: pass
            })
        });

        // Nota: Debido a 'no-cors', no podemos leer la respuesta directamente de la petición POST.
        // Vamos a usar un pequeño truco: pediremos los datos mediante un GET después de enviar el intento.
        verificarResultado(user, pass);

    } catch (error) {
        console.error("Error en login:", error);
        loginBtn.disabled = false;
        loginBtn.innerText = "Entrar";
    }
}

async function verificarResultado(user, pass) {
    const errorMsg = document.getElementById('error-msg');
    const loginBtn = document.getElementById('login-btn');

    // Consultamos al script mediante GET para validar
    const urlConsulta = `${WEB_APP_URL}?action=login&user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`;
    
    try {
        const res = await fetch(urlConsulta);
        const data = await res.json();

        if (data.status === "success") {
            // Guardar sesión si "Recordarme" está activo
            if (document.getElementById('remember').checked) {
                localStorage.setItem('apa_session', JSON.stringify(data));
            }
            
            // Si el login es correcto, guardamos el rol y nombre en memoria temporal
            sessionStorage.setItem('user_role', data.rol);
            sessionStorage.setItem('user_name', data.nombre);

            // ¡Éxito! Redirigir a la pantalla principal (que crearemos luego)
            alert("¡Bienvenido/a " + data.nombre + "!");
            window.location.href = 'home.html'; 
        } else {
            errorMsg.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.innerText = "Entrar";
        }
    } catch (e) {
        errorMsg.innerText = "Error de conexión";
        errorMsg.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.innerText = "Entrar";
    }
}