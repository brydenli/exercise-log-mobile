import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import styles from './styles.js';
import Main from './components/main';
import Amplify from 'aws-amplify';
import awsconfig from './src/aws-exports';

Amplify.configure(awsconfig);


export default function App() {
	return (
		<View style={styles.container}>
			<Main/>
			<StatusBar style='auto' />
		</View>
	);
}
