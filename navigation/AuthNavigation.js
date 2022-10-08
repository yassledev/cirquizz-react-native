import {
    createSwitchNavigator,
    createAppContainer,
    createDrawerNavigator,
    createBottomTabNavigator,
    createStackNavigator,
    StackNavigator
    } from 'react-navigation';
import React from 'react';
import Account from "../activity/Account";
import DownloadedCircuit from '../activity/DownloadedCircuit';
import Circuit from "../activity/Circuit";
import Game from "../activity/Game";
import Home from "../activity/Home";
import { Icon } from 'native-base';
import FullDescription from '../components/Circuit/Description/FullDescription';
import CommentaireDescription from  '../components/Circuit/Description/Commentaire';
import CircuitDescription from "../components/Circuit/Description/CIrcuitDescription";
import IntermediateStart from "../components/Circuit/IntermediateStart"
import I18n from "../translations/i18n";

const AllCirquizz = createStackNavigator({
    Circuit: Circuit,
    Description: CircuitDescription,
    'FullDescription': FullDescription,
    'CommentaireDescription': CommentaireDescription,
    },
{
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#16f3bc'
        }
    }
});

const MyCirquizz = createStackNavigator({
    'MyCirquizz': DownloadedCircuit,
},
{
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#16f3bc'
        }
    }
});

const MyAccount = createStackNavigator({
    'Account': Account
},
{
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#16f3bc'
        }
    }
});

const BottomNavigation = createBottomTabNavigator({
    [I18n.t('carte')] :  {
        screen: AllCirquizz,
        navigationOptions: {
            tabBarIcon: () => (
                <Icon name='map' />
            ),
            headerStyle: {
                backgroundColor: '#444444',
            },
        },
    },

    [I18n.t('mesCicuits')]:  {
        screen: MyCirquizz,
        navigationOptions: {
            tabBarIcon: () => (
                <Icon name='dashboard' type='MaterialIcons'/>
            ),
            headerStyle: {
                backgroundColor: '#444444',
            },
        },
    },
    [I18n.t('monCompte')] : {
        screen: MyAccount,
        navigationOptions: {
            tabBarIcon: () => (
                <Icon name='contact' />
            ),
            headerStyle: {
                backgroundColor: '#f4511e',
            },
        },
    }
}, {
    tabBarOptions: {
        showIcon: true,
        activeTintColor: 'black',
        inactiveTintColor: 'grey',
        style: {
            backgroundColor: '#16f3bc'
        }
    },
});

const GameStack = createStackNavigator({
    'Jeu': Game
});
const AuthNavigation = createSwitchNavigator({
    'Home': Home,
    'App': BottomNavigation,
    'Game': Game,
    IntermediateStart: IntermediateStart
},{
    initialRouteName: 'App'
});

export default AuthNavigation;