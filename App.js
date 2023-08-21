import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

import * as Font from 'expo-font';

// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
	// Setup State variable to check when the Custom Font is loaded
	const [fontLoaded, setFontLoaded] = useState(false);

	// Load the Custom Font
	useEffect(() => {
		const loadFont = async () => {
			await Font.loadAsync({
				'custom-font': require('./assets/Poppins/Poppins-Black.ttf'),
			});
			setFontLoaded(true);
		};

		loadFont();
	}, []);

	// Show Loading indicator until Font is loaded
	if (!fontLoaded) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator
					size='large'
					color='blue'
				/>
			</View>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Start'>
				<Stack.Screen
					name='Start'
					component={Start}
				/>
				<Stack.Screen
					name='Chat'
					component={Chat}
				/>
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
