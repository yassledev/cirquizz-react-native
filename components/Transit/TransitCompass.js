import React from 'react';
// import { Permissions, Magnetometer } from 'expo';
import {SensorTypes, magnetometer, setUpdateIntervalForType} from "react-native-sensors";

import { Image, ImageBackground, Dimensions } from 'react-native';
import MapView, {UrlTile, Marker} from 'react-native-maps';
import {  Container, Button, Text, View, Icon, Left, Right, Body } from 'native-base';
import * as geolib from 'geolib'
import I18n from '../../translations/i18n';
import GPSState from 'react-native-gps-state'

let my_var;

let interval_toogle;

const WIDTH = Dimensions.get('window').width - 150;


export default class TransitCompass extends React.Component {
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
    error : null,
      x: 0,
      y: 0,
      z: 0,
      timestamp: 0
  };

  checkPosition = () => {

    if (geolib.isPointWithinRadius(
        {latitude: this.state.location.latitude, longitude: this.state.location.longitude},
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
      this._toggle()
      setUpdateIntervalForType(SensorTypes.magnetometer, 100);

      //interval_toogle = setInterval(() => this._toggle(), 100);
  }



  componentWillUnmount() {
    this._unsubscribe();
    clearInterval(my_var);
    navigator.geolocation.clearWatch(this.watchId);
  }

  _toggle = () => {
      if(this._subscription)
      {
          this._unsubscribe()
      }
      else
      {
          this._subscribe();
      }

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
      let {x, y, z, timestamp} = magnetometer;
      let angle;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      }
      else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
      let a =  Math.round(angle);
      a = a - 90 >= 0 ? a - 90 : a + 271;

     // if (a !== this.state.angle){
        
        this.setState({ angle : a, i: this.state.i+1, x, y, z, timestamp });
     // }
    }
    
}; 
 
 render() {
    !this.state.location && this.getLocation();
    this.state.location && this.checkPosition();
// image old data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAilBMVEX///8ZFxwZFh0AAAAXFRkQDA60s7Tz8/MZFxr///78/PwYFhz//f8bGR7z8fQWFBiop6gLCA96eXrU0tMFAAodGx50cnXJycpQT1BubW9cXFwvLTKWlZjf3eGioqI9Oz6PjZCHhofo6OpqaGq5ubnDwcPs6u4/PUFJR0kmJCcrKyuKiopfX1+lpaQSxq1yAAACjUlEQVR4nO3ZbVOjMBSGYehBCYQUsKtV13attbvu2///e5sEZLvaat2CDHhf0xm/1Jk8c/JykgYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPrAsS+/c3zTteyTdmcplEQfjzZgFsZyIXJ+ONJ8Ti9HKh7SVTJJkfFFj0ZNQqbCUaH3vp2swspAuoZ5YOi8lv9j0PZ72uYSV0IT5J5Gzedb3mNrlZ6m2JiZ0lMj31Swd0WyNxVav5jIqpXKRHz9nfQ+sNbGoJmET1NiQ+e0icC3B4OfsjoRNJb/cLrIgSwc+X3cndHurNvaYfLi563uEx9qb0DI6tJX8tlz0Pcij7Enod1c/XUNbycvia/XtIU7XVJR+nvDJmrQhf7murgu/pTzpUFnmNsDLCd3uakIfchq0fwkpJIpU1J08OiRhVclSyvUmbnuqFjJ5XPed0O5zSEK7Mu3Hhmy7dS1cy9FhQu+ghNU3TWRb13Wbm2tVQ92R8A0J/T+4ZudhuWhznhZil8AhI3gPNt7nG1e/NhMupWtq/2nRVFg1XVyL0WqL044Vr56HPqCt3qrVyfl+4tcT+nvxLPNvjwMMuX0/3FU+G+/8bNCXxf0JjXGHvLqYu3YtqfQ92v+Q7E3oT76rzdT3aclwE1bvNFvqrTOyfej63q66JE2HeaVo/E1Y35hM6O4S5bVvs8dgK2F9+pX1fXCYO+dzdUJTJ/Tx6pvgKPL9sw5V5J4sBv8u89TjXqptV3ZevciMpHaVJJhKqKum0/fUwzwQXuQS2qbz1nVloypeY2qvFyvXlWUj/OnQSeKred9jwHHSUW4uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH90fP9UmKExMYX0AAAAASUVORK5CYII=
    return (
      !this.state.location ? <Text> {I18n.t('BesoinGPS')}</Text> : 
      <Container>
        <View style={{alignItems: 'center', flex: 1}}>
          <Text style={{height: 50, fontSize: 18, fontWeight: 'bold'}}>{I18n.t('PseudoBoussoleIndic')}</Text>
          <View style={{width: '75%', height: '75%'}}>
          <ImageBackground source={require('../../assets/boussole-fond.png')} style={{alignItem: 'center',  width: '100%', height: '100%'}}>
            <View style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flex: 1}}>
              <Image
                style={{width: 250, height: 250, transform: [{ rotate: - this.state.angle + this.state.ang + 'deg' }]}}
                source={require('../../assets/boussole.png')}
                />
            </View>
          </ImageBackground>
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