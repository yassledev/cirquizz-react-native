import React from 'react';
// import { Permissions, Magnetometer } from 'expo';
import { magnetometer } from "react-native-sensors";

import { Image } from 'react-native';
import MapView, {UrlTile, Marker} from 'react-native-maps';
import {  Container, Button, Text, View, Icon, Left, Right, Body } from 'native-base';
import * as geolib from 'geolib'
import I18n from '../../translations/i18n';
import GPSState from 'react-native-gps-state'

let my_var;

let interval_toogle;

export default class TransitCompass_Test extends React.Component {
    state = {
        me: {
            latitude: 0,
            longitude: 0
        },
        location: {
            latitude: 0,
            longitude: 0
        },
        showNext: false,
        circuit : null,
        angle : 90,
        ang : 0,
        i : 0,
        error : null
    };

    checkPosition = () => {

        if (geolib.isPointWithinRadius(
            {latitude: this.state.me.latitude, longitude: this.state.me.longitude},
            {latitude: this.props.circuit.latitude, longitude: this.props.circuit.longitude},
            this.props.circuit.tolerance
        )){
            this.state.showNext = true;
        }

    }

    getLocation = async () => {
        this.watchId = navigator.geolocation.watchPosition((position) => {
            let region = {
                latitude:       position.coords.latitude,
                longitude:      position.coords.longitude,
                latitudeDelta:  0.00922*1.5,
                longitudeDelta: 0.00421*1.5
            };
            const Dest ={latitude: this.props.circuit.latitude, longitude:this.props.circuit.longitude}; // Destination
            const Origin ={latitude: this.state.me.latitude, longitude: this.state.me.longitude}; // Origine
            const ang = Math.round(geolib.getGreatCircleBearing(Origin, Dest));

            this.setState({location: region, ang});
        },(error) =>         {
            this.setState({ error: error.message });
        },{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 0 });
        // TODO
        /*let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if(status !== 'granted'){
            this.setState({
                error: 'Permission to access location was denied'
            });
        } else {
            this.watchId = navigator.geolocation.watchPosition((position) => {
                let region = {
                    latitude:       position.coords.latitude,
                    longitude:      position.coords.longitude,
                    latitudeDelta:  0.00922*1.5,
                    longitudeDelta: 0.00421*1.5
                };

                const Dest ={latitude: this.props.circuit.latitude, longitude:this.props.circuit.longitude}; // Destination
                const Origin ={latitude: this.state.me.latitude, longitude: this.state.me.longitude}; // Origine
                const ang = Math.round(geolib.getBearing(Origin, Dest));

                this.setState({location: region, ang});
            },(error) =>         {
                this.setState({ error: error.message });
                console.log("Error Compass :" + error.message)
            },{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 0 });
        }*/

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
        Version Prod
        f (this.state.i%30 === 0){
          this.getLocation();
        }

         */
        if (prevState.location.latitude !== this.state.location.latitude || prevState.location.longitude !== this.state.location.longitude) {
            const Dest ={latitude: this.props.circuit.latitude, longitude:this.props.circuit.longitude}; // Destination
            const Origin ={latitude: this.state.location.latitude, longitude: this.state.location.longitude}; // Origine
            const ang = Math.round(geolib.getGreatCircleBearing(Origin, Dest));

            this.setState( {ang});
        }


        /*
       if (prevState.me.latitude !== this.state.me.latitude || prevState.me.longitude !== this.state.me.longitude){
        const Dest ={latitude: this.props.circuit.latitude, longitude:this.props.circuit.longitude}; // Destination
        const Origin ={latitude: this.state.me.latitude, longitude: this.state.me.longitude}; // Origine
        const ang = Math.round(geolib.getGreatCircleBearing(Origin, Dest));

        this.setState( {ang});
       }

       */

    }

    location = () => {
        if(GPSState.isAuthorized()){
            this.getLocation();
            clearInterval(my_var)
        }
    };

    componentWillMount(){
        my_var = setInterval(() => this.location(), 1000);
    }

    componentDidMount() {
        console.warn(JSON.stringify(magnetometer));
        GPSState.addListener((status) => {
            if(status)
            {
                console.warn("status");
                switch (status) {
                    case GPSState.NOT_DETERMINED:
                        console.warn("not determined");
                        break;

                    case GPSState.RESTRICTED:
                        console.warn("restricted");
                        this.setState({ location: null})
                        break;

                    case GPSState.DENIED:
                        console.warn("denied");
                        break;

                    case GPSState.AUTHORIZED:
                        console.warn("authorized");
                        break;
                    case GPSState.AUTHORIZED_ALWAYS:
                        //TODO do something amazing with you app
                        break;

                    case GPSState.AUTHORIZED_WHENINUSE:
                        //TODO do something amazing with you app
                        break;
                }
            }

        });
        interval_toogle = setInterval(() => this._toggle(), 100);
    }



    componentWillUnmount() {
        this._unsubscribe();
        clearInterval(interval_toogle);
        clearInterval(my_var);
        navigator.geolocation.clearWatch(this.watchId);
    }

    _toggle = () => {
        this._subscribe();
    };

    _subscribe = () => {
        this._subscription = magnetometer.subscribe(result => {
            this._angle(result);
        });
    };

    _unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    };

    _angle = (magnetometer) => {
        if (magnetometer) {
            let {x, y} = magnetometer;
            let angle;
            if (Math.atan2(y, x) >= 0) {
                angle = Math.atan2(y, x) * (180 / Math.PI);
            }
            else {
                angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
            }
            let a =  Math.round(angle);
            a = a - 90 >= 0 ? a - 90 : a + 271;

            if (a !== this.state.angle){

                this.setState({ angle : a, i: this.state.i+1 });
            }
        }

    };

    render() {
        !this.state.location && this.getLocation();
        this.state.me && this.checkPosition();
// image old data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAilBMVEX///8ZFxwZFh0AAAAXFRkQDA60s7Tz8/MZFxr///78/PwYFhz//f8bGR7z8fQWFBiop6gLCA96eXrU0tMFAAodGx50cnXJycpQT1BubW9cXFwvLTKWlZjf3eGioqI9Oz6PjZCHhofo6OpqaGq5ubnDwcPs6u4/PUFJR0kmJCcrKyuKiopfX1+lpaQSxq1yAAACjUlEQVR4nO3ZbVOjMBSGYehBCYQUsKtV13attbvu2///e5sEZLvaat2CDHhf0xm/1Jk8c/JykgYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPrAsS+/c3zTteyTdmcplEQfjzZgFsZyIXJ+ONJ8Ti9HKh7SVTJJkfFFj0ZNQqbCUaH3vp2swspAuoZ5YOi8lv9j0PZ72uYSV0IT5J5Gzedb3mNrlZ6m2JiZ0lMj31Swd0WyNxVav5jIqpXKRHz9nfQ+sNbGoJmET1NiQ+e0icC3B4OfsjoRNJb/cLrIgSwc+X3cndHurNvaYfLi563uEx9qb0DI6tJX8tlz0Pcij7Enod1c/XUNbycvia/XtIU7XVJR+nvDJmrQhf7murgu/pTzpUFnmNsDLCd3uakIfchq0fwkpJIpU1J08OiRhVclSyvUmbnuqFjJ5XPed0O5zSEK7Mu3Hhmy7dS1cy9FhQu+ghNU3TWRb13Wbm2tVQ92R8A0J/T+4ZudhuWhznhZil8AhI3gPNt7nG1e/NhMupWtq/2nRVFg1XVyL0WqL044Vr56HPqCt3qrVyfl+4tcT+nvxLPNvjwMMuX0/3FU+G+/8bNCXxf0JjXGHvLqYu3YtqfQ92v+Q7E3oT76rzdT3aclwE1bvNFvqrTOyfej63q66JE2HeaVo/E1Y35hM6O4S5bVvs8dgK2F9+pX1fXCYO+dzdUJTJ/Tx6pvgKPL9sw5V5J4sBv8u89TjXqptV3ZevciMpHaVJJhKqKum0/fUwzwQXuQS2qbz1nVloypeY2qvFyvXlWUj/OnQSeKred9jwHHSUW4uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH90fP9UmKExMYX0AAAAASUVORK5CYII=
        return (
            !this.state.location ? <Text> {I18n.t('BesoinGPS')}</Text> :
                <Container>
                    <View style={{alignItems: 'center', height: 150}}>
                        <Text style={{height: 50}}>{I18n.t('PseudoBoussoleIndic')}</Text>

                        <Image
                            style={{width: 66, height: 58, transform: [{ rotate: /*- this.state.angle*/ + this.state.ang - 90 + 'deg' }]}}
                            source={{uri: 'data:image/png;base64,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'}}

                        />
                    </View>

                    <Text>{this.state.location.longitude} {this.state.location.latitude}</Text>


                    <View style={{ flexDirection: "row", display: 'flex', alignItems: 'center',
                        justifyContent:'center',flex: 1, position: "absolute",
                        bottom: 20, padding: 15 }}>
                        <Left>

                        </Left>
                        <Body>
                            {this.state.showNext === true &&
                            <Button
                                onPress={() => this.props.next()}>
                                <Text>{I18n.t('BonEndroit')}</Text>
                            </Button>}
                        </Body>

                        <Right>
                            <Button style={{alignSelf: "flex-end"}}
                                    onPress={() => this.props.changeMenu('Instruction')}
                                    rounded warning>
                                <Icon name="info-circle" />
                            </Button>
                        </Right>
                    </View>
                </Container>
        );
    }
}

/*


        <MapView
          style={{ flex: 1 }}
          showsUserLocation
          loadingEnabled
          initialRegion={this.state.location}
          mapType="none">

          <UrlTile urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {<Marker
            title="Moi"
            draggable
            pinColor="blue"
            onDragEnd={(e) => { this.setState({me: e.nativeEvent.coordinate})}}
            coordinate={{
                latitude: this.state.location.latitude,
                longitude: this.state.location.longitude
            }} /> }
        </MapView>
 */