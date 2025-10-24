// Este listener asegura que el código se ejecute SOLO cuando toda la página HTML esté cargada.
document.addEventListener('DOMContentLoaded', function() {
    
    // ----------------------------------------------------------------------
    // LÓGICA DEL FORMULARIO DE LOGIN (login.html) - (Tu código original)
    // ----------------------------------------------------------------------
    
    const form = document.getElementById('form-login'); 

    if (form) { 
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const emailInput = document.getElementById('email-login');
            const senhaInput = document.getElementById('senha-login');

            const email = emailInput.value.trim(); 
            const senha = senhaInput.value.trim();

            if (email === '' || senha === '') {
                alert('Por favor, ingresa tu E-mail y tu Contraseña para continuar.');
                return;
            }

            const USER_EMAIL = "admin@escola.com";
            const USER_SENHA = "1234"; 

            if (email === USER_EMAIL && senha === USER_SENHA) {
                console.log('Login exitoso. Redirigiendo a dashboard.html');
                window.location.href = 'dashboard.html'; 
            } else {
                alert('E-mail o Contraseña incorrectos. Inténtalo de nuevo.');
                senhaInput.value = '';
            }
        });
    } 

    // ----------------------------------------------------------------------
    // LÓGICA DEL FORMULARIO DE CADASTRO (cadastro.html) - (Corregido)
    // ----------------------------------------------------------------------
    
    const formCadastro = document.getElementById('cadastro-form'); // ID de tu HTML

    if (formCadastro) {
        formCadastro.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const nome = document.getElementById('nome').value.trim();
            const fechaNacimiento = document.getElementById('fecha-nac').value.trim();
            const gradoEscolar = document.getElementById('grado').value.trim();

            if (nome === '' || fechaNacimiento === '' || gradoEscolar === '') {
                alert('Por favor, completa todos los campos del formulario de registro.');
                return;
            }

            console.log('Datos de Cadastro Capturados:', {nombre: nome, fechaNacimiento: fechaNacimiento, grado: gradoEscolar});

            alert(`Estudiante ${nome} registrado con éxito en ${gradoEscolar}° Grado.`);

            formCadastro.reset();
        });
    }


    // ----------------------------------------------------------------------
    // LÓGICA DEL MÓDULO PAGAMENTO (pagamento.html) - (NUEVA LÓGICA)
    // ----------------------------------------------------------------------
    
    const pagamentosBody = document.getElementById('pagamentos-body');

    if (pagamentosBody) {
        // Datos de ejemplo para simular pagos
        const dataPagamentos = [
            { vencimiento: '2025-11-01', descripcion: 'Mensualidad Noviembre', monto: '€120.00', estado: 'Pendiente', clase: 'pendiente' },
            { vencimiento: '2025-10-01', descripcion: 'Mensualidad Octubre', monto: '€120.00', estado: 'Pagado', clase: 'pagado' },
            { vencimiento: '2025-09-01', descripcion: 'Mensualidad Septiembre', monto: '€120.00', estado: 'Pagado', clase: 'pagado' },
            { vencimiento: '2025-12-01', descripcion: 'Mensualidad Diciembre', monto: '€120.00', estado: 'Pendiente', clase: 'pendiente' },
        ];

        // Función para renderizar los pagos en la tabla
        dataPagamentos.forEach(pago => {
            const row = pagamentosBody.insertRow();
            
            // Crea las celdas
            const celdaVencimiento = row.insertCell(0);
            const celdaDescripcion = row.insertCell(1);
            const celdaMonto = row.insertCell(2);
            const celdaEstado = row.insertCell(3);

            // Asigna los valores
            celdaVencimiento.textContent = pago.vencimiento;
            celdaDescripcion.textContent = pago.descripcion;
            celdaMonto.textContent = pago.monto;
            celdaEstado.textContent = pago.estado;

            // Añade un estilo condicional simple al estado
            celdaEstado.classList.add(pago.clase); 
        });

        console.log('Tabla de Pagamentos cargada con datos de simulación.');
    }


    // ----------------------------------------------------------------------
    // LÓGICA DE CERRAR SESIÓN (logout) - (Tu código original)
    // ----------------------------------------------------------------------

    const logoutLink = document.getElementById('logout-link');

    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            console.log('Sesión cerrada. Redirigiendo a login.html');
            window.location.href = 'login.html'; 
        });
    }

});


