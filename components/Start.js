// import { SvgXml } from 'react-native-svg'; // Import the SvgXml component
import React, { useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ImageBackground,
	TextInput,
	TouchableOpacity,
	Dimensions,
} from 'react-native';

// Background Image
const imageBackground = require('../assets/Background-Image.png');

// Grab Screen size to use for easier alignment of components
const screenHeight = Dimensions.get('window').height;

// List of 5 colors that will be shown to the user as options for the background
const colorOptions = ['#474056', '#757083', '#8A95A5', '#B9C6AE', '#FFFFFF'];

// *******************************************************************
const Start = ({ navigation }) => {
	// The name of the user will be passed to the Chat Component
	const [name, setName] = useState('');

	// Background Color State is set to white as Default
	const [backgroundColor, setBackgroundColor] = useState('#FFFFFF'); // Default background color

	// Function to change the Background Color
	const changeBackgroundColor = (color) => {
		setBackgroundColor(color);
	};

	return (
		<View style={styles.container}>
			{/* Image BackGround */}
			<ImageBackground
				source={imageBackground}
				resizeMode='cover'
				style={styles.imageBackground}>
				{/* TITLE  */}
				<Text style={styles.textTitle}>Chatster</Text>

				{/* Container text input */}
				<View style={[styles.miniContainer, { backgroundColor: backgroundColor }]}>
					{/* Text input box */}
					<TextInput
						style={styles.textInput}
						value={name}
						onChangeText={setName}
						placeholder='UserName'
						placeholderTextColor='gray'
					/>

					{/* Color Options Box */}
					<View>
						<Text style={styles.chooseColorText}>Choose the Background Color</Text>

						<View style={styles.colorOptionsContainer}>
							{colorOptions.map((color, index) => (
								<TouchableOpacity
									key={index}
									style={[styles.colorOption, { backgroundColor: color }]}
									onPress={() => changeBackgroundColor(color)}></TouchableOpacity>
							))}
						</View>
					</View>

					{/* Start Chatting Button */}
					<TouchableOpacity
						style={styles.customButton} // Apply customButton style
						onPress={() =>
							navigation.navigate('Chat', { name: name, backgroundColor: backgroundColor })
						}>
						<Text style={styles.buttonText}>Start Chatting</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	// Styles the Image Background
	imageBackground: {
		flex: 1,
		width: 'auto',
		justifyContent: 'center',
	},

	// Styles the Title
	textTitle: {
		position: 'absolute',
		top: 60,
		alignSelf: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 5,
		fontFamily: 'custom-font',
		color: '#FFFFFF',
		fontSize: 45,
		fontWeight: 600,
	},

	// Styles the container holding the input text box, color choice and Start Chatting button
	miniContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		width: '88%',
		height: screenHeight * 0.4, // 44% of screen height is too high, i prefer 40%
		backgroundColor: 'white',
		borderRadius: 5,
		alignSelf: 'center',

		alignItems: 'center',
		position: 'absolute',
		bottom: '3%',
	},

	// Styles the placeholder inside the text input box
	textInput: {
		width: '88%',
		padding: 15,
		backgroundColor: 'white',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#ddd',
		shadowColor: '#000',
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 5,
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
	},

	// Styles the text above the color choices 'Choose the Background color'
	chooseColorText: {
		alignSelf: 'center',
		color: '#757083',
	},

	// Styles the View containing the 5 color circles
	colorOptionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		borderColor: '#ddd',
		width: '80%',
		borderColor: 'gray',
		paddingVertical: 10,
		paddingLeft: 8,
		borderRadius: 5,
	},

	// Styles the Color Circles
	colorOption: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 1,
	},

	// Styles the Button 'Start Chatting'
	customButton: {
		alignItems: 'center',
		width: '88%',
		backgroundColor: 'white',
		borderRadius: 5,
		backgroundColor: '#757083',
		color: 'white',
		borderColor: '#ddd',
		shadowColor: '#000',
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 5,
		elevation: 3,
		paddingVertical: 15,
	},

	// Styles the Text of Button 'Start Chatting'
	buttonText: {
		color: '#FFFFFF',
	},
});

export default Start;
