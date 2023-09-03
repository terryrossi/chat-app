import { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	Alert,
	TouchableOpacity,
	TextInput,
	FlatList,
} from 'react-native';

// Import Gifted Chat Components
import { Bubble, GiftedChat, Day } from 'react-native-gifted-chat';

// Import Firebase/FireStore Components and functions
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';

// *************************************************************

const Chat = ({ db, route, navigation }) => {
	const { userId, name, backgroundColor } = route.params; // Getting Parametres fro Start Component
	// console.log(userId, name, backgroundColor);

	// Messages Array
	const [messages, setMessages] = useState([]);

	// Access Firestore in Real Time (Websockets)

	useEffect(() => {
		navigation.setOptions({ title: name });
		const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
		const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
			let newMessages = [];
			documentsSnapshot.forEach((doc) => {
				newMessages.push({
					id: doc.id,
					...doc.data(),
					createdAt: new Date(doc.data().createdAt.toMillis()), // Transform Timestamp to handle date in the App
				});
			});
			setMessages(newMessages);
		});

		// Clean up code
		return () => {
			if (unsubMessages) unsubMessages();
		};
	}, []);

	const renderDay = (props) => {
		return (
			<Day
				{...props}
				textStyle={{ color: 'red' }}
			/>
		);
	};

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

	// Send new Messages to Firestore
	const onSend = (newMessages) => {
		addDoc(collection(db, 'messages'), newMessages[0]);
	};

	// ****************************************************************
	// ********************** R E N D E R ****************************
	return (
		<View style={[styles.container, { backgroundColor: backgroundColor }]}>
			{/* <View> */}
			<GiftedChat
				messages={messages}
				renderBubble={renderBubble}
				// renderDay={renderDay}
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
