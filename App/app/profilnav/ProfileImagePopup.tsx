import React, { useImperativeHandle, forwardRef } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileImagePopupProps {
  apiUrl: string;
  setProfileData: (data: any) => void;
}

interface CustomFile {
  uri: string;
  name: string;
  type: string;
}

const ProfileImagePopup = forwardRef((props: ProfileImagePopupProps, ref) => {
  const { apiUrl, setProfileData } = props;

  const handleImportImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("L'autorisation d'accéder à la pellicule est requise !");
      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    const response = await ImagePicker.launchImageLibraryAsync(options);

    if (!response.canceled && response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      const file: CustomFile = {
        uri: asset.uri,
        name: 'profile-picture.jpg',
        type: 'image/jpeg',
      };
      updateProfilePicture(file);
    }
  };

  const updateProfilePicture = async (file: CustomFile) => {
    const userToken = await AsyncStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('image', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type' : 'multipart/form-data',
        'Authorization': userToken,
      },
      body: formData,
    };

    fetch(`${apiUrl}/img/pp/upload`, options)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProfileData((prevState: any) => ({
            ...prevState,
            profilePic: data.url, // Use the URL from the response
          }));
        } else {
          console.error('Failed to update profile picture:', data.msg);
        }
      })
      .catch(error => {
        console.error('Error updating profile picture:', error);
      });
  };

  const handleResetProfilePic = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const formData = new FormData();
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken,
      },
      body: formData,
    };

    fetch(`${apiUrl}/img/resetPP`, options)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProfileData((prevState: any) => ({
            ...prevState,
            profilePic: data.url,
          }));
        } else {
          console.error('Failed to reset profile picture', data.msg);
        }
      })
      .catch(error => {
        console.error('Error resetting profile picture:', error);
      });
  };

  useImperativeHandle(ref, () => ({
    showPopup() {
      Alert.alert(
        'Modifier la photo de profil',
        'Choisissez une option',
        [
          { text: 'Importer une image', onPress: handleImportImage },
          { text: 'Réinitialiser la photo de profil', onPress: handleResetProfilePic },
          { text: 'Annuler', style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  }));

  return null;
});

export default ProfileImagePopup;
