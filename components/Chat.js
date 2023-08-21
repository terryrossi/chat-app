import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat, Day } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
	const { name, backgroundColor } = route.params;
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		navigation.setOptions({ title: name });
	}, []);

	useEffect(() => {
		setMessages([
			{
				_id: 1,
				text: 'You have entered the Chat!',
				createdAt: new Date(),
				system: true,
			},
			{
				_id: 2,
				text: `Hello ${name}`,
				createdAt: new Date(),
				user: {
					_id: 2,
					name: 'React Native',
					avatar: 'https://placeimg.com/140/140/any',
				},
			},
		]);
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

	const onSend = (newMessages) => {
		setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
	};

	return (
		<View style={[styles.container, { backgroundColor: backgroundColor }]}>
			{/* <View> */}
			<GiftedChat
				messages={messages}
				renderBubble={renderBubble}
				// renderDay={renderDay}
				onSend={(messages) => onSend(messages)}
				user={{
					_id: 1,
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
