// JavaScript pour gérer le changement de formulaire avec animation de hauteur
function toggleForms(clickedElementId) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerLink = document.getElementById('registerLink');
    const alreadyHaveAccountBtn = document.getElementById('alreadyHaveAccountBtn');

    if (clickedElementId === 'registerLink') {
        loginForm.classList.remove('active-form');
        registerForm.classList.add('active-form');
        alreadyHaveAccountBtn.style.display = 'inline';
        registerLink.style.display = 'none';

        
        // Affiche le formulaire d'inscription après un court délai
        setTimeout(() => {
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
        }, 300);
    } else if (clickedElementId === 'alreadyHaveAccountBtn') {
        registerForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
        registerLink.style.display = 'inline';
        alreadyHaveAccountBtn.style.display = 'none';

        // Affiche le formulaire de connexion après un court délai
        setTimeout(() => {
            registerForm.style.display = 'none';
            loginForm.style.display = 'flex';
        }, 300);
    }
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

    const options = {
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    }
    fetch('/api/user/connexion',options)
    .then(response=>response.json())
    .then(data=>{
        console.log(data)
        if(data.success){
            const u = data.user
            if (typeof localStorage.getItem("ArosajeToken") === 'undefined') localStorage.setItem("ArosajeToken", u.uid)
            if (typeof localStorage.getItem("ArosajeFirstName") === 'undefined') localStorage.setItem("ArosajeFirstName", u.firstName)
            if (typeof localStorage.getItem("ArosajeLastName") === 'undefined') localStorage.setItem("ArosajeLastName", u.lastName)
            if (typeof localStorage.getItem("ArosajeEmail") === 'undefined') localStorage.setItem("ArosajeEmail", u.email)
            if (typeof localStorage.getItem("ArosajeAddress") === 'undefined') localStorage.setItem("ArosajeAddress", u.address)
            if (typeof localStorage.getItem("ArosajeCity") === 'undefined') localStorage.setItem("ArosajeCity", u.cityName)
            if (typeof localStorage.getItem("ArosajePhone") === 'undefined') localStorage.setItem("ArosajePhone", u.phone)
            fetch('../page/accueil.html')
            .then(response=>{
                return response.text();
            })
            .then(html=>{
                console.log(html)
                document.querySelector('body').innerHTML = html
                document.getElementById('prenomUser').innerText = u.firstName + ' ' + u.lastName;
                document.getElementById('mailUser').innerText = u.email;
                document.getElementById('adresUser').innerText = u.address;
                document.getElementById('villUser').innerText = u.cityName;
                document.getElementById('phoneUser').innerText = u.phone;
            })
            .catch(e=>console.error(e))
        }
        showAlerteMessage(data.message)
    })
    .catch(e=>{
        console.error(e)
    })
}

function validateRegistrationForm() {
    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const registerEmail = document.getElementById('registerEmail').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const cityName = document.getElementById('cityName').value.trim();
    const registerPassword = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (lastName === '') {
        showAlerteMessage('Veuillez saisir votre nom.');
        document.getElementById('lastName').focus();
        return false;
    }
    if (firstName === '') {
        showAlerteMessage('Veuillez saisir votre prénom.');
        document.getElementById('firstName').focus();
        return false;
    }
    if (!emailRegex.test(registerEmail)) {
        showAlerteMessage('Veuillez saisir une adresse email valide.');
        document.getElementById('registerEmail').focus();
        return false;
    }
    if (address === '') {
        showAlerteMessage('Veuillez saisir votre adresse.');
        document.getElementById('address').focus();
        return false;
    }
    if (phone === '') {
        showAlerteMessage('Veuillez saisir votre numéro de téléphone.');
        document.getElementById('phone').focus();
        return false;
    }
    if (cityName === '') {
        showAlerteMessage('Veuillez saisir le nom de votre ville.');
        document.getElementById('cityName').focus();
        return false;
    }
    if (registerPassword === '') {
        showAlerteMessage('Veuillez saisir votre mot de passe.');
        document.getElementById('registerPassword').focus();
        return false;
    }
    if (!passwordRegex.test(registerPassword)) {
        showAlerteMessage('Le mot de passe doit comporter au moins 8 caractères, inclure une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.');
        document.getElementById('registerPassword').focus();
        return false;
    }
    if (registerPassword !== confirmPassword) {
        showAlerteMessage('Les mots de passe ne correspondent pas.');
        document.getElementById('confirmPassword').focus();
        return false;
    }

    fetch('/api/user/createUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                    lastName: lastName,
                    firstName: firstName,
                    email: registerEmail,
                    address: address,
                    phone: phone,
                    cityName: cityName,
                    password: registerPassword
                })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlerteMessage('Inscription réussie.');
            toggleForms('alreadyHaveAccountBtn');
        } else {
            showAlerteMessage('Échec de l\'inscription.');
        }
    })
    .catch(error => {
        showAlerteMessage('Erreur lors de l\'inscription.');
    });

    return false;
}

function togglePasswordVisibility(passwordFieldId, toggleButton) {
    const passwordField = document.getElementById(passwordFieldId);
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleButton.textContent = 'Cacher';
    } else {
        passwordField.type = 'password';
        toggleButton.textContent = 'Montrer';
    }
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

