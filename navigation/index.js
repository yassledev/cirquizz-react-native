import React from "react";
import { 
    createSwitchNavigator,
    createAppContainer,
    } from 'react-navigation';
import AuthNavigation from './AuthNavigation';
import NotAuthNavigation from "./NotAuthNavigation";
import AppLoading from '../activity/AppLoading';

const App = createSwitchNavigator({
    'NotAuth': NotAuthNavigation,
    'Auth': AuthNavigation,
    'AppLoading': AppLoading
}, {
    initialRouteName: 'AppLoading'
});

export default createAppContainer(App);

/*
import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import FontAwesome, { Icons } from 'react-native-fontawesome';

class HomeScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Home!</Text>
            </View>
        );
    }
}

class SettingsScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Settings!</Text>
            </View>
        );
    }
}

const TabNavigator = createBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarLabel:"Home Page",
            tabBarIcon: () => (
                <FontAwesome>{Icons.chevronLeft}</FontAwesome>
            ),
            headerStyle: {
                backgroundColor: '#f4511e',
            },
        },
    },
    Settings: SettingsScreen,
}, {
    tabBarOptions: {
        showIcon: true
    },
});

export default createAppContainer(TabNavigator);*/
