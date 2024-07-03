import { useImperativeHandle, forwardRef } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ProfileImagePopupProps {
  apiUrl: string;
  token: string;
  setProfileData: (data: any) => void;
}

const ProfileImagePopup = forwardRef((props: ProfileImagePopupProps, ref) => {
  const { apiUrl, token, setProfileData } = props;

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
      const base64Image = await getBase64(asset.uri);
      updateProfilePicture(base64Image);
    }
  };

  const getBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); // get only the base64 part
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const updateProfilePicture = (base64Image: string) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        file: base64Image,
      }),
    };
  
    fetch(`${apiUrl}/api/pic/setPP`, options)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProfileData((prevState: any) => ({
            ...prevState,
            profilePic: `data:image/png;base64,${base64Image}`,
          }));
        } else {
          console.error('Failed to update profile picture:', data.message);
        }
      })
      .catch(error => {
        console.error('Error updating profile picture:', error);
      });
  };
  
  const handleResetProfilePic = () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
      }),
    };
  
    fetch(`${apiUrl}/api/pic/resetPP`, options)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProfileData((prevState: any) => ({
            ...prevState,
            profilePic: data.body.defaultPic,
          }));
        } else {
          console.error('Failed to reset profile picture:', data.message);
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
