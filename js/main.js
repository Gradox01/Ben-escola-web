// Archivo js/main.js - Lógica Principal Consolidada

// Espera a que el DOM (estructura HTML) esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {

    // ASUMIMOS que las variables 'auth' (Autenticación) y 'db' (Firestore)
    // fueron definidas globalmente en js/firebase-init.js

    // ======================================================================
    // 1. LÓGICA DE AUTENTICACIÓN Y REDIRECCIÓN GLOBAL (SEGURIDAD)
    // ======================================================================

    // Listener de estado de autenticación: Controla el acceso a las páginas
    // Esta función se ejecuta cada vez que el estado del usuario cambia (inicia sesión, cierra sesión, o carga la página)
    if (typeof auth !== 'undefined') { // Verifica que Firebase Auth esté cargado
        auth.onAuthStateChanged(user => {
            const isLoginPage = window.location.pathname.includes('login.html');
            const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.split('/').pop() === '';

            // A) Si NO hay usuario y NO estamos en la página de login o index, redirigimos a login.html
            if (!user && !isLoginPage && !isIndexPage) {
                window.location.href = 'login.html';
            }
            
            // B) Si HAY usuario y estamos en login.html o index.html, redirigimos a dashboard.html
            if (user && (isLoginPage || isIndexPage)) {
                window.location.href = 'dashboard.html';
            }

            // C) Si el usuario está autenticado, cargamos los datos específicos del módulo
            if (user) {
                // Estas funciones se llaman si existen y si el usuario está logueado
                if (typeof loadPagamentos === 'function') loadPagamentos();
                if (typeof loadAlimentos === 'function') loadAlimentos();
            }
        });
    }


    // Lógica de "Cerrar Sesión" para todos los enlaces con la clase 'logout'
    document.querySelectorAll('.logout').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof auth !== 'undefined') {
                auth.signOut().then(() => {
                    // Después de cerrar sesión, redirige al login
                    window.location.href = 'login.html';
                }).catch((error) => {
                    console.error("Error al cerrar sesión:", error);
                });
            } else {
                console.error("Servicio de autenticación no disponible.");
            }
        });
    });


    // ======================================================================
    // 2. LÓGICA DEL MÓDULO LOGIN (login.html) - INICIO DE SESIÓN
    // ======================================================================

    // Usa el ID 'login-form' que añadimos a tu formulario en login.html
    const loginForm = document.getElementById('login-form'); 

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Usamos 'email' y 'senha' de tu HTML
            const email = document.getElementById('email').value;
            const password = document.getElementById('senha').value;
            // Busca un div de mensaje (si existe) para mostrar errores/estados
            const messageDiv = document.getElementById('login-message'); 
            
            if (messageDiv) {
                messageDiv.textContent = 'Iniciando sesión...';
                messageDiv.style.color = 'blue';
            }
            
            if (typeof auth !== 'undefined') {
                auth.signInWithEmailAndPassword(email, password)
                    .then(() => {
                        // Éxito: onAuthStateChanged (sección 1) se encarga de la redirección
                        console.log("Usuario autenticado. Redirección en curso.");
                    })
                    .catch((error) => {
                        console.error("Error de inicio de sesión:", error);
                        
                        let friendlyMessage = "Error de autenticación. Verifica tu correo y contraseña.";
                        if (error.code === 'auth/user-not-found') {
                            friendlyMessage = "Usuario no encontrado. ¿Necesitas registrarte?";
                        } else if (error.code === 'auth/wrong-password') {
                            friendlyMessage = "Contraseña incorrecta.";
                        } else if (error.code === 'auth/invalid-email') {
                            friendlyMessage = "Formato de correo inválido.";
                        } 

                        if (messageDiv) {
                            messageDiv.textContent = friendlyMessage;
                            messageDiv.style.color = 'red';
                        } else {
                            // Si no hay div, usamos un alert simple
                            alert(friendlyMessage);
                        }
                    });
            } else {
                alert("Error: El servicio de autenticación no se cargó. Revisa js/firebase-init.js.");
            }
        });
    }


    // ======================================================================
    // 3. LÓGICA DE MÓDULOS DE DATOS (Pagamento, Alimentação, Cadastro)
    // ======================================================================
    // Esta sección permanece igual a tu código original, asegurando que tus módulos de datos funcionen.
    
    const pagamentosBody = document.getElementById('pagamentos-body');
    const alimentacaoBody = document.getElementById('alimentacao-body');
    const cadastroForm = document.getElementById('cadastro-form');

    // Funciones de Carga
    function loadPagamentos() {
        if (!pagamentosBody || typeof db === 'undefined') return; 

        db.collection('pagamentos').orderBy("fechaVencimiento", "desc").onSnapshot((querySnapshot) => {
            pagamentosBody.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const pagamento = doc.data();
                const estado = pagamento.estado || 'N/A';
                const estadoColor = estado === 'Pagado' ? 'green' : (estado === 'Pendiente' ? 'orange' : 'gray');
                const monto = pagamento.monto ? `R$ ${pagamento.monto}` : 'N/A';
                const fechaVencimiento = pagamento.fechaVencimiento || 'N/A';

                const row = pagamentosBody.insertRow();
                row.insertCell(0).textContent = fechaVencimiento;
                row.insertCell(1).textContent = pagamento.descripcion || 'N/A';
                row.insertCell(2).textContent = monto;
                
                const estadoCell = row.insertCell(3);
                estadoCell.textContent = estado;
                estadoCell.style.color = estadoColor;
                estadoCell.style.fontWeight = 'bold';
            });
        }, (error) => {
            console.error("Error al suscribirse a pagos:", error);
            pagamentosBody.innerHTML = `<tr><td colspan="4" style="color: red; text-align: center;">Error al cargar pagos: ${error.message}</td></tr>`;
        });
    }

    function loadAlimentos() {
        if (!alimentacaoBody || typeof db === 'undefined') return;

        db.collection('alimentacao').onSnapshot((querySnapshot) => {
            alimentacaoBody.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const menu = doc.data();
                
                const row = alimentacaoBody.insertRow();
                row.insertCell(0).textContent = menu.dia || 'N/A';
                row.insertCell(1).textContent = menu.desayuno || 'N/A';
                row.insertCell(2).textContent = menu.almuerzo || 'N/A';
                row.insertCell(3).textContent = menu.cena || 'N/A';
            });
        }, (error) => {
             console.error("Error al suscribirse a alimentación:", error);
             alimentacaoBody.innerHTML = `<tr><td colspan="4" style="color: red; text-align: center;">Error al cargar el menú: ${error.message}</td></tr>`;
        });
    }

    if (cadastroForm && typeof db !== 'undefined') {
        cadastroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const fechaNacimiento = document.getElementById('fechaNacimiento').value;
            const grado = document.getElementById('grado').value;
            
            const messageDiv = document.getElementById('cadastro-message');

            db.collection('estudiantes').add({
                nombre: nombre,
                fechaNacimiento: fechaNacimiento,
                grado: grado,
                fechaRegistro: new Date()
            })
            .then((docRef) => {
                if(messageDiv) {
                    messageDiv.textContent = `Estudiante ${nombre} registrado con éxito. ID: ${docRef.id}`;
                    messageDiv.style.color = 'green';
                }
                cadastroForm.reset();
            })
            .catch((error) => {
                console.error("Error al añadir documento: ", error);
                if(messageDiv) {
                    messageDiv.textContent = "Error al guardar el registro. Revisa la consola.";
                    messageDiv.style.color = 'red';
                }
            });
        });
    }

    // Exportar funciones globalmente (para que onAuthStateChanged pueda llamarlas)
    window.loadPagamentos = loadPagamentos;
    window.loadAlimentos = loadAlimentos;

});