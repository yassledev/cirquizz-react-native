import React, {Component} from 'react';
import MapView, {UrlTile, Marker, Callout} from 'react-native-maps';
import * as geolib from 'geolib';
import { Button, Text, View, Icon, Left, Right, Body } from 'native-base';
import { ImageBackground, Image, Dimensions } from 'react-native';
import GPSState from 'react-native-gps-state'

let my_var;
const WIDTH = Dimensions.get('window').width - 150;

export default class TransitCoordinates extends Component {

    state = {
        me: null,
        location: null,
        showNext: false
    };



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

    checkPosition = () => {
        if (geolib.isPointWithinRadius(
             {latitude: this.props.location.latitude, longitude: this.props.location.longitude},
             {latitude: this.props.circuit.latitude, longitude: this.props.circuit.longitude},
             this.props.circuit.tolerance
        )){
             this.state.showNext = true;
        }
    };

    render(){
        this.props.location && this.checkPosition();
        return (
            !this.props.location ? <Text> Activez votre GPS, vous en aurez besoin pour cette étape.</Text> : 
            <View style={{flex: 1}}>
                <MapView
                    style={{ flex: 1 }}
                    showsUserLocation
                    followsUserLocation
                    loadingEnabled
                    initialRegion={this.props.location}
                    mapType="none">

                    <UrlTile
                        urlTemplate="https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    />

                    <Marker
                        pinColor="blue"
                        coordinate={{
                            latitude: this.props.circuit.latitude,
                            longitude: this.props.circuit.longitude
                        }} 
                    />

                </MapView>

                <View style={{ alignItems: 'center', justifyContent: 'center',paddingTop:60, marginTop: '-10%'}}>
                    <Image source={require("../../assets/mask-bottom.png")} style={[ {position: 'absolute', top:0, left:0, right:0, width:'100%', resizeMode:'stretch', alignSelf: 'flex-end'}]}/>
                    <View style={{width: '90%', marginLeft: '5%'}}>
                         <Text style={{fontSize: 24, color:'#346086', fontWeight: 'bold', marginBottom: 20, alignSelf: 'center'}}>Dirigez-vous vers le point pour achever l'étape</Text>
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

            </View>
        )
    }
}