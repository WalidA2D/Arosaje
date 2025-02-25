var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useImperativeHandle, forwardRef } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProfileImagePopup = forwardRef((props, ref) => {
    const { apiUrl, setProfileData } = props;
    const handleImportImage = () => __awaiter(void 0, void 0, void 0, function* () {
        const permissionResult = yield ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("L'autorisation d'accéder à la pellicule est requise !");
            return;
        }
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        };
        const response = yield ImagePicker.launchImageLibraryAsync(options);
        if (!response.canceled && response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
            const file = {
                uri: asset.uri,
                name: 'profile-picture.jpg',
                type: 'image/jpeg',
            };
            updateProfilePicture(file);
        }
    });
    const updateProfilePicture = (file) => __awaiter(void 0, void 0, void 0, function* () {
        const userToken = yield AsyncStorage.getItem('userToken');
        const formData = new FormData();
        formData.append('image', {
            uri: file.uri,
            name: file.name,
            type: file.type,
        });
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': userToken || '',
            },
            body: formData,
        };
        fetch(`${apiUrl}/img/pp/upload`, options)
            .then(response => response.json())
            .then(data => {
            if (data.success) {
                setProfileData((prevState) => (Object.assign(Object.assign({}, prevState), { profilePic: data.url })));
            }
            else {
                console.error('Failed to update profile picture:', data.msg);
            }
        })
            .catch(error => {
            console.error('Error updating profile picture:', error);
        });
    });
    const handleResetProfilePic = () => __awaiter(void 0, void 0, void 0, function* () {
        const userToken = yield AsyncStorage.getItem('userToken');
        const formData = new FormData();
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken || '',
            },
            body: formData,
        };
        fetch(`${apiUrl}/img/resetPP`, options)
            .then(response => response.json())
            .then(data => {
            if (data.success) {
                setProfileData((prevState) => (Object.assign(Object.assign({}, prevState), { profilePic: data.url })));
            }
            else {
                console.error('Failed to reset profile picture', data.msg);
            }
        })
            .catch(error => {
            console.error('Error resetting profile picture:', error);
        });
    });
    useImperativeHandle(ref, () => ({
        showPopup() {
            Alert.alert('Modifier la photo de profil', 'Choisissez une option', [
                { text: 'Importer une image', onPress: handleImportImage },
                { text: 'Réinitialiser la photo de profil', onPress: handleResetProfilePic },
                { text: 'Annuler', style: 'cancel' },
            ], { cancelable: true });
        }
    }));
    return null;
});
export default ProfileImagePopup;
