import React, { useState } from 'react';
import './addBotaniste.css';

const AddBotaniste = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        address: '',
        phone: '',
        cityName: '',
        password: '',
        isBotanist: true,
    });

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        for (let key in formData) {
            if (formData[key] === '' || formData[key] === false) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(formData);
            closeModal();
        } else {
            setError('Tous les champs doivent être remplis.');
        }
    };

    return (
        <div className="modal">
            <div className="modalHeader">
                <h2>Ajouter un botaniste</h2>
            </div>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        />
                    <label>Nom</label>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                    <label>Prénom</label>
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <label>Email</label>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                    <label>Adresse</label>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    <label>Téléphone</label>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="cityName"
                        value={formData.cityName}
                        onChange={handleInputChange}
                    />
                    <label>Ville</label>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <label>Mot de passe provisoire</label>
                </div>
                <button type="submit" className="submit-button">Ajouter</button>
                <button onClick={closeModal} className="close-button">Fermer</button>
            </form>
        </div>
    );
};

export default AddBotaniste;
