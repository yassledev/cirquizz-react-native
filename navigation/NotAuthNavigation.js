import {
    createBottomTabNavigator,
    createStackNavigator,
    } from 'react-navigation';
import React from 'react';
import Circuit from "../activity/Circuit";
import Login from "../activity/Login";
import Register from "../activity/Register";
import Auth from "../activity/Auth";
import CircuitDescription from '../components/Circuit/Description/CIrcuitDescription';
import FullDescription from '../components/Circuit/Description/FullDescription';
import CommentaireDescription from  '../components/Circuit/Description/Commentaire';
import DownloadedCircuit from '../activity/DownloadedCircuit';
import { Icon } from 'native-base';

const AllCirquizz = createStackNavigator({
    'Circuit': Circuit,
    'Description': CircuitDescription,
    'FullDescription': FullDescription,
    'CommentaireDescription': CommentaireDescription
},{
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#16f3bc'
        }
    }
});

const Authentication = createStackNavigator({
    'Authentication': Auth,
    'Login': Login,
    'Register': Register
},
{
    initialRouteName: 'Authentication',
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

const BottomNavigation = createBottomTabNavigator({
    'Rechercher': {
        screen: AllCirquizz,
        navigationOptions: {
            tabBarIcon: () => (
                <Icon name='search' />
            ),
            headerStyle: {
                backgroundColor: '#444444',
            },
        },
    },
    'Authentification' :  {
        screen: Authentication,
        navigationOptions: {
            tabBarIcon: () => (
                <Icon name='login' type="AntDesign"/>
            ),
            headerStyle: {
                backgroundColor: '#f4511e',
            },
        },
    },
},{
    initialRouteName: 'Rechercher',
    tabBarOptions: {
        showIcon: true,
        activeTintColor: 'black',
        inactiveTintColor: 'grey',
        style: {
            backgroundColor: '#16f3bc'
        }
    },
});

export default BottomNavigation;