function toggleForms(clickedElementId) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerLink = document.getElementById('registerLink');
    const alreadyHaveAccountBtn = document.getElementById('alreadyHaveAccountBtn');

    if (clickedElementId === 'registerLink') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        alreadyHaveAccountBtn.style.display = 'inline';
        registerLink.style.display = 'none';
    } else if (clickedElementId === 'alreadyHaveAccountBtn') {
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
        registerLink.style.display = 'inline';
        alreadyHaveAccountBtn.style.display = 'none';
    }
}

function togglePasswordVisibility(inputFieldId, toggleButton) {
    const inputField = document.getElementById(inputFieldId);
    const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
    inputField.setAttribute('type', type);
    toggleButton.textContent = type === 'password' ? 'Montrer' : 'Cacher';
}

function validateLoginForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email.trim()) {
        showAlerteMessage('Veuillez saisir votre adresse email.')
        
        return false;
    }

    if (!password.trim()) {
        showAlerteMessage('Veuillez saisir votre mot de passe.');
        
        return false;
    }

    return true;
}

function validateRegistrationForm() {
    const registerEmail = document.getElementById('registerEmail').value;
    const registerPassword = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(registerEmail)) {
        showAlerteMessage('Veuillez saisir une adresse email valide.');
        return false;
    }

    if (registerPassword.trim() === '') {
        showAlerteMessage('Veuillez saisir votre mot de passe.');
        return false;
    }


    if (registerPassword !== confirmPassword) {
        showAlerteMessage('Les mots de passe ne correspondent pas.');
        return false;
    }

    return true;
}

function showAlerteMessage(message) {

    const alertElement = document.createElement('div');
    alertElement.classList.add('alert');
    alertElement.textContent = message;

    const messageContainer = document.getElementById('message-container');

    const alertsActuelles = messageContainer.getElementsByClassName('alert');
    if (alertsActuelles.length > 0) {

        alertsActuelles[0].remove();
    }

    messageContainer.appendChild(alertElement);

    setTimeout(() => {
        alertElement.remove();
    }, 4000);
}

