// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

import * as Font from 'expo-font';

// Import Application Components
import Start from './components/Start';
import Chat from './components/Chat';

// Firestore Functions
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';

// Prevent warning message: "AsyncStorage has been extracted from" to appear
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['AsyncStorage has been extracted from']);

// Import NetInfo to check on status of network connection
import { useNetInfo } from '@react-native-community/netinfo';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
	// *************************************************************
	// ********************** F O N T S ****************************

	// Setup State variable to check when the Custom Font is loaded
	// const [fontLoaded, setFontLoaded] = useState(false);
	// Load the Custom Font
	// useEffect(() => {
	// 	const loadFont = async () => {
	// 		await Font.loadAsync({
	// 			'custom-font': require('./assets/Poppins/Poppins-Black.ttf'),
	// 		});
	// 		setFontLoaded(true);
	// 	};
	// 	loadFont();
	// }, []);

	// Show Loading indicator until Font is loaded
	// if (!fontLoaded) {
	// 	return (
	// 		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
	// 			<ActivityIndicator
	// 				size='large'
	// 				color='blue'
	// 			/>
	// 		</View>
	// 	);
	// }
	// *********************************************************************
	// ********************** F I R E S T O R E ****************************

	// define a new state that represents the network connectivity status
	const connectionStatus = useNetInfo();

	// code that will display an alert popup if connection is lost
	useEffect(() => {
		if (connectionStatus.isConnected === false) {
			Alert.alert('Connection lost!');
			disableNetwork(db);
		} else if (connectionStatus.isConnected === true) {
			enableNetwork(db);
		}
	}, [connectionStatus.isConnected]);

	// Firestore Params
	const firebaseConfig = {
		apiKey: 'AIzaSyDGux5lSBHOaosPhEQ-gYj3Jyesu-1XIv4',
		authDomain: 'chat-app-c1636.firebaseapp.com',
		projectId: 'chat-app-c1636',
		storageBucket: 'chat-app-c1636.appspot.com',
		messagingSenderId: '782177217087',
		appId: '1:782177217087:web:c99c72cda97eaa7781e68a',
	};
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	// ***************************************************************
	// ********************** R E N D E R ****************************

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Start'>
				<Stack.Screen
					name='Start'
					component={Start}
				/>
				<Stack.Screen name='Chat'>
					{(props) => (
						<Chat
							db={db}
							isConnected={connectionStatus.isConnected}
							{...props}
						/>
					)}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default App;
