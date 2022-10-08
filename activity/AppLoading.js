import React, { Component } from 'react';
import {PermissionsAndroid, Image} from 'react-native';
import { Container, Text, Button } from 'native-base';
import { isLogged } from '../services';
import { synchroGames, synchroCircuits } from '../services/circuits';

import Dimensions from 'Dimensions';
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


export default class AppLoading extends Component {

    state = {
        isReady: false,
        gpsAuth: false,
    }

    loadApp = async() => {
        const userLogged = await isLogged();
        if(userLogged){
           await synchroGames();
        }
        this.props.navigation.navigate(userLogged ? 'Auth' : 'NotAuth');
    }

    componentWillMount(){
        this.loadApp();
    }

    render() {

        return (
            <Container>
                <Image source={require('../assets/bg.png')} style={{ height: DEVICE_HEIGHT, width: DEVICE_WIDTH }}/>
            </Container>
        );
    }
}