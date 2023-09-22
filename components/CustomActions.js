import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

// needed to fetch Gifted Chat's ActionSheet
import { useActionSheet } from '@expo/react-native-action-sheet';

// Import ImagePicker to use expo's API to access device's photos, media, files
import * as ImagePicker from 'expo-image-picker';

// Import MediaLibrary to allow saving photos on the user's Device
import * as MediaLibrary from 'expo-media-library';

// Geolocalization
import * as Location from 'expo-location';

// Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userId }) => {
	// The following reference (object) contains the showActionSheetWithOptions() function,
	// which will initialize and show the ActionSheet
	const actionSheet = useActionSheet();

	// to upload a file, we have to prepare a new reference for it on the Storage Cloud
	const newUploadRef = ref(storage, 'image123');

	const onActionPress = () => {
		// Array to show in ActionSheet (the additional actions)
		const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
		const cancelButtonIndex = options.length - 1;

		actionSheet.showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
			},
			async (buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						pickImage();
						console.log('user wants to pick an image');
						return;
					case 1:
						takePhoto();
						console.log('user wants to take a photo');
						return;
					case 2:
						getLocation();
						console.log('user wants to get their location');
					default:
				}
			}
		);
	};

	// Uploads image to Firestore DB and sends to GiftedChat
	const uploadAndSendImage = async (imageURI) => {
		const uniqueRefString = generateReference(imageURI);
		const newUploadRef = ref(storage, uniqueRefString);
		const response = await fetch(imageURI);
		const blob = await response.blob();
		uploadBytes(newUploadRef, blob).then(async (snapshot) => {
			const imageURL = await getDownloadURL(snapshot.ref);
			onSend({ image: imageURL });
		});
	};

	// Pick an image from the device's library
	const pickImage = async () => {
		let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissions?.granted) {
			let result = await ImagePicker.launchImageLibraryAsync();
			if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
			else Alert.alert("Permissions haven't been granted.");
		}
	};

	// This function allows user to take a photo, use it in the App and save it on the device
	const takePhoto = async () => {
		let permissions = await ImagePicker.requestCameraPermissionsAsync();
		if (permissions?.granted) {
			let result = await ImagePicker.launchCameraAsync();
			if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
			else Alert.alert("Permissions haven't been granted.");
		}
	};

	// The foloowing function is needed to use a unique reference string each time a new file is uploaded
	const generateReference = (uri) => {
		const timeStamp = new Date().getTime();
		const imageName = uri.split('/')[uri.split('/').length - 1];
		return `${userId}-${timeStamp}-${imageName}`;
	};

	// This function allows the user to share his/her location
	const getLocation = async () => {
		let permissions = await Location.requestForegroundPermissionsAsync();
		if (permissions?.granted) {
			const location = await Location.getCurrentPositionAsync({});
			if (location) {
				onSend({
					location: {
						longitude: location.coords.longitude,
						latitude: location.coords.latitude,
					},
				});
			} else Alert.alert('Error occurred while fetching location');
		} else Alert.alert("Permissions haven't been granted.");
	};

	// ****************************************************************
	// ********************** R E N D E R ****************************

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onActionPress}>
			<View style={[styles.wrapper, wrapperStyle]}>
				<Text style={[styles.iconText, iconTextStyle]}>+</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10,
	},
	wrapper: {
		borderRadius: 13,
		borderColor: '#b2b2b2',
		borderWidth: 2,
		flex: 1,
	},
	iconText: {
		color: '#b2b2b2',
		fontWeight: 'bold',
		fontSize: 10,
		backgroundColor: 'transparent',
		textAlign: 'center',
	},
});

export default CustomActions;
