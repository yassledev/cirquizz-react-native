import React, { Component } from 'react';
import { MOBILE_URL, HEADERS } from '../../constants/Request';

import Speedometer from 'react-native-speedometer-chart';
import I18n from '../../translations/i18n';
import MapView, {UrlTile, Marker, Callout} from 'react-native-maps';
import * as geolib from 'geolib'
import {  Container, Button, Text, View, Icon, Left, Right, Body } from 'native-base';
import GPSState from "react-native-gps-state";
import { Image, ImageBackground, Dimensions } from 'react-native';
var tinycolor = require("tinycolor2");


let my_var;


const WIDTH = Dimensions.get('window').width - 150;



export default class TransitTempature extends Component {



    state = {
        location: {
            latitude: 0,
            longitude: 0
        },
        showNext: false,
        circuit : null,
        couleur : '#0000FF',
        angle : 90,
        indication : I18n.t('N')
    }

    getLocation = async () => {
        this.watchId = navigator.geolocation.watchPosition((position) => {
            let region = {
                latitude:       position.coords.latitude,
                longitude:      position.coords.longitude,
                latitudeDelta:  0.00922*1.5,
                longitudeDelta: 0.00421*1.5
            };
            this.setState({location: region});
        },(error) =>         {
            this.setState({ error: error.message });
        },{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 0 });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.location && (prevState.location.latitude !== this.state.location.latitude || prevState.location.longitude !== this.state.location.longitude)) {
            const A =[prevState.location.latitude, prevState.location.longitude];
            const B =[this.props.circuit.latitude, this.props.circuit.longitude];
            const C =[this.state.location.latitude, this.state.location.longitude];

            const result = (((B[0]-A[0])*(C[0]-A[0])) + ((B[1]-A[1])*(C[1]-A[1]))) /
                (Math.sqrt(Math.pow(B[0]-A[0], 2) + Math.pow(B[1]-A[1], 2) ) * Math.sqrt(Math.pow(C[0]-A[0], 2) + Math.pow(C[1]-A[1], 2) ));

            let sta ={
                indication : I18n.t('N'),
                rouge : 0,
                vert : 0,
                bleu : 255,
            };

            if (result > 0.2) {
                if (result > 0.7) {
                    sta = {
                        indication : I18n.t('TB'),
                        rouge : 0,
                        vert : result * 255,
                        bleu : 255 - (result * 255),
                    };
                }
                else {
                    sta = {
                        indication : I18n.t('B'),
                        rouge : 0,
                        vert : result * 255,
                        bleu : 255 - (result * 255),
                    };
                }
            }
            else if (result < -0.2) {
                if (result < -0.7) {
                    sta = {
                        indication : I18n.t('TM'),
                        rouge : (- result) * 255,
                        vert : 0,
                        bleu : 255 + (result * 255),
                    };
                }
                else {
                    sta = {
                        indication : I18n.t('M'),
                        rouge : (- result) * 255,
                        vert : 0,
                        bleu : 255 + (result * 255),
                    };
                }

            }
            else {
                sta ={
                    indication : I18n.t('N'),
                    rouge : 0,
                    vert : 0,
                    bleu : 255,
                };
            }
            const angle = (result + 1) * 90;
            const couleur = tinycolor({r: sta.rouge, g: sta.vert, b: sta.bleu}).toHexString();
            this.setState( {couleur, angle, indication : sta.indication});
        }
    }

    checkPosition = () => {

        if (geolib.isPointWithinRadius(
            {latitude: this.state.location.latitude, longitude: this.state.location.longitude},
            {latitude: this.props.circuit.latitude, longitude: this.props.circuit.longitude},
            this.props.circuit.tolerance
        )){
            this.state.showNext = true;
        }
    }
    componentWillUpdate(){

    }

    location = () => {
        if(GPSState.isAuthorized()){
            this.getLocation();
            clearInterval(my_var)
        }
    }


    componentWillMount(){
        my_var = setInterval(() => this.location(), 1000);
        this.getLocation();
    }

    componentWillUnmount() {
        clearInterval(my_var);
        navigator.geolocation.clearWatch(this.watchLoc);
    }

    render(){
        this.state.location && this.checkPosition();
        return (
            !this.state.location ? <Text>{I18n.t('BesoinGPS')}</Text> : 
            <Container>
                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <Speedometer 
                        showText
                        showIndicator 
                        value={this.state.angle / 180 * 100}
                        totalValue={100} 
                        internalColor={this.state.couleur} 
                        textStyle={{ color: this.state.couleur }} 
                        size={325} text={this.state.indication} /> 

                    <View style={{flexDirection: 'row'}}>
                        <Text style={{flex : 1, textAlign: 'center'}}>{I18n.t('MD')}</Text>
                        <Text style={{flex : 1, textAlign: 'center'}}>{I18n.t('BD')}</Text>
                    </View>

                </View>



                <View style={{ alignItems: 'center', justifyContent: 'center',paddingTop:60}}>
                    <Image source={require("../../assets/mask-bottom.png")} style={[ {position: 'absolute', top:0, left:0, right:0, width:'100%', resizeMode:'stretch', alignSelf: 'flex-end'}]}/>
                    <View style={{width: '90%', marginLeft: '5%'}}>
                        <Text style={{fontSize: 26, color:'#346086', fontWeight: 'bold', marginBottom: 20, alignSelf: 'center'}}>Dirigez-vous vers le point pour achever l'étape</Text>
                    </View>
                    
                    {this.state.showNext ?
                            <Button full light 
                                style={{width: WIDTH, alignItems: 'center', justifyContent: 'center', borderRadius: 25,margin:30,marginTop:0,alignSelf:'center'}}
                                onPress={() => this.props.next()}>
                                <Text style={{fontWeight: 'bold'}}>J'y suis !</Text>
                            </Button>
                            :
                            <View style={{marginBottom: 30}} />
                    }
                </View>
            </Container>
        );
    }
}