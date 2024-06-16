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

    // Tests passés
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
            fetch('../page/accueil.html')
            .then(response=>{
                return response.text();
            })
            .then(html=>{
                console.log(html)
                document.querySelector('body').innerHTML = html
                document.getElementById('prenomUser').innerText = data.user.firstName + ' ' + data.user.lastName;
                document.getElementById('mailUser').innerText = data.user.email;
                document.getElementById('adresUser').innerText = data.user.address;
                document.getElementById('villUser').innerText = data.user.cityName;
                document.getElementById('phoneUser').innerText = data.user.phone;
            })
            .catch(e=>console.error(e))
        }
        showAlerteMessage(data.message) //ici j'affiche le message reçu par la bdd
    })
    .catch(e=>{
        console.error(e)
    })
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

