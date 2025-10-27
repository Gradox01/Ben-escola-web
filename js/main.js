// Archivo js/main.js - Lógica Principal Consolidada y SEGURA

document.addEventListener('DOMContentLoaded', () => {

    // ASUMIMOS que las variables 'auth' y 'db' fueron definidas globalmente en firebase-config.js

    // ======================================================================
    // 1. LÓGICA DE AUTENTICACIÓN Y REDIRECCIÓN GLOBAL (AHORA ACTIVA)
    // ======================================================================

    // Listener de estado de autenticación: Controla el acceso a las páginas
    auth.onAuthStateChanged(user => {
        const isLoginPage = window.location.pathname.includes('login.html');

        // Si NO hay usuario y NO estamos en la página de login, redirigimos a login.html
        if (!user && !isLoginPage) {
            const currentPath = window.location.pathname.split('/').pop();
            // Solo redirige si estás en una página de contenido (no index/root)
            if (currentPath !== 'index.html' && currentPath !== '') {
                window.location.href = 'login.html';
            }
        }
        
        // Si HAY usuario y estamos en login.html, redirigimos a dashboard.html
        if (user && isLoginPage) {
            window.location.href = 'dashboard.html';
        }

        // Si el usuario está autenticado, cargamos los datos específicos del módulo
        if (user) {
            // Verificamos si las funciones de carga existen y las llamamos
            if (typeof loadPagamentos === 'function') loadPagamentos();
            if (typeof loadAlimentos === 'function') loadAlimentos();
        }
    });


    // Lógica de "Cerrar Sesión" para todos los enlaces con la clase 'logout'
    document.querySelectorAll('.logout').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut().then(() => {
                // Después de cerrar sesión, redirige al login
                window.location.href = 'login.html';
            }).catch((error) => {
                console.error("Error al cerrar sesión:", error);
            });
        });
    });


    // ======================================================================
    // 2. LÓGICA DEL MÓDULO LOGIN (login.html) - INICIO DE SESIÓN
    // ======================================================================

    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('login-message');
            
            if (messageDiv) {
                messageDiv.textContent = 'Iniciando sesión...';
                messageDiv.style.color = 'blue';
            }

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Si es exitoso, onAuthStateChanged se encarga de la redirección
                    console.log("Usuario autenticado. Redirección gestionada por onAuthStateChanged.");
                })
                .catch((error) => {
                    console.error("Error de inicio de sesión:", error);
                    
                    let friendlyMessage = "Error de autenticación. Verifica tu correo y contraseña.";
                    if (error.code === 'auth/user-not-found') {
                        friendlyMessage = "Usuario no encontrado.";
                    } else if (error.code === 'auth/wrong-password') {
                        friendlyMessage = "Contraseña incorrecta.";
                    } else if (error.code === 'auth/invalid-email') {
                         friendlyMessage = "Formato de correo inválido.";
                    } else {
                        friendlyMessage = `Error de Firebase: ${error.code}`;
                    }

                    if (messageDiv) {
                        messageDiv.textContent = friendlyMessage;
                        messageDiv.style.color = 'red';
                    }
                });
        });
    }


    // ======================================================================
    // 3. LÓGICA DE MÓDULOS DE DATOS (Pagamento, Alimentação, Cadastro)
    // ======================================================================
    
    // Aquí definimos los selectores de los módulos de datos
    const pagamentosBody = document.getElementById('pagamentos-body');
    const alimentacaoBody = document.getElementById('alimentacao-body');
    const cadastroForm = document.getElementById('cadastro-form');

    // Funciones de Carga
    function loadPagamentos() {
        if (!pagamentosBody) return; 

        // Listener de Real-Time (onSnapshot) es mejor que get() para dashboards
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
        if (!alimentacaoBody) return;

        // Listener de Real-Time (onSnapshot)
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

    if (cadastroForm) {
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

    // Exportar funciones globalmente (necesario para el onAuthStateChanged)
    window.loadPagamentos = loadPagamentos;
    window.loadAlimentos = loadAlimentos;

});
