import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';

// Import Gifted Chat Components
import { Bubble, GiftedChat, InputToolbar, Day } from 'react-native-gifted-chat';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Firebase/FireStore Components and functions
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

// additional actions component
import CustomActions from './CustomActions';

import MapView from 'react-native-maps';

// *************************************************************

const Chat = ({ db, storage, route, navigation, isConnected }) => {
	const { userId, name, backgroundColor } = route.params;
	// db = Firestore Database
	// storage = Firestore Storage
	// route = Parametres from Start Component
	// navigation = Navigtion API from '@react-navigation/native';
	// isConnected = Checks if there is an internet connection for offline use

	// Messages Array
	const [messages, setMessages] = useState([]);

	// Access Firestore in Real Time (Websockets)
	//
	// Fetch Method using Real Time Data Updates from firestore (onSnapshot)
	let unsubMessages;

	useEffect(() => {
		navigation.setOptions({ title: name });

		if (isConnected === true) {
			// unregister current onSnapshot() listener to avoid registering multiple listeners when
			// useEffect code is re-executed.
			if (unsubMessages) unsubMessages();
			unsubMessages = null;

			// Creates the query to access the Firestore DB
			const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

			// if connection, Access Firestore DB using query q
			unsubMessages = onSnapshot(q, (documentsSnapshot) => {
				let newMessages = [];
				documentsSnapshot.forEach((doc) => {
					newMessages.push({
						id: doc.id,
						...doc.data(),
						createdAt: new Date(doc.data().createdAt.toMillis()), // Transform Timestamp to handle date in the App
					});
				});
				// Caches the message lists in AsyncStorage
				cacheMessageLists(newMessages);
				// Sets state variable lists
				setMessages(newMessages);
			});
		} else {
			// if no conection, Loads lists from AsyncStorage
			loadCachedLists();
		}

		// Clean up code
		return () => {
			if (unsubMessages) unsubMessages();
		};
	}, [isConnected]);

	// separate functions to access AsyncStorage because it needs to be async/await
	// Which is not permitted directly inside useEffect()
	// Note the use of || to initialize the list as empty in case AsyncStorage is
	// not definned
	const loadCachedLists = async () => {
		const cachedLists = (await AsyncStorage.getItem('message_lists')) || [];
		setMessages(JSON.parse(cachedLists));
	};

	const cacheMessageLists = async (listsToCache) => {
		try {
			await AsyncStorage.setItem('message_lists', JSON.stringify(listsToCache));
		} catch (error) {
			console.log(error.message);
		}
	};

	// Customized rendering of the date Color
	const renderDay = (props) => {
		return (
			<Day
				{...props}
				textStyle={{ color: 'red' }}
			/>
		);
	};

	// Customized rendering of the Bubbles Colors
	const renderBubble = (props) => {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					// right: {
					// 	backgroundColor: 'blue',
					// },
					left: {
						backgroundColor: 'orange',
					},
				}}
				textStyle={{
					right: {
						color: 'white',
					},
					left: {
						color: 'white',
					},
				}}
				timeTextStyle={{
					left: {
						color: 'white',
					},
					right: {
						color: 'white',
					},
				}}
				systemTextStyle={{
					color: 'black',
				}}
			/>
		);
	};

	// Input Bar at the bottom
	const renderInputToolbar = (props) => {
		if (isConnected) return <InputToolbar {...props} />;
		else return null;
	};

	// Additional actions ("+" circle sign on the left of input field)
	const renderCustomActions = (props) => {
		return (
			<CustomActions
				storage={storage}
				userId={userId}
				{...props}
			/>
		);
	};

	// Renders a Map with the location using MapView Component
	const renderCustomView = (props) => {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	};

	// Sends new Messages to Firestore for persistence in Firestore DB
	const onSend = (newMessages) => {
		addDoc(collection(db, 'messages'), newMessages[0]);
	};

	// ****************************************************************
	// ********************** R E N D E R ****************************
	return (
		<View style={[styles.container, { backgroundColor: backgroundColor, marginBottom: 10 }]}>
			{/* <View> */}
			<GiftedChat
				messages={messages}
				// OverRiding renderBuble prop for custom colors
				renderBubble={renderBubble}
				// OverRiding renderDay prop for custom colors
				// renderDay={renderDay}
				// OverRiding renderInputToolBar prop to remove if no internet connection
				renderInputToolbar={renderInputToolbar}
				// Additional actions ("+" circle sign on the left of input field)
				renderActions={renderCustomActions}
				// Function that will render MapView
				renderCustomView={renderCustomView}
				onSend={(messages) => onSend(messages)}
				user={{
					_id: userId,
					name: name,
				}}
			/>
			{Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
			{Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='padding' /> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
	},
});

export default Chat;
