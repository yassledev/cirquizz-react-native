import React, { Component } from 'react';
import { Container, Text, View } from 'native-base';
import { MOBILE_URL, HEADERS } from '../constants/Request';
import Datastore from 'react-native-local-mongodb';
import CircuitMap from '../components/Circuit/CircuitMap';
import {NetInfo, PermissionsAndroid, ToastAndroid} from "react-native";
import { isLogged } from '../services';

export default class Circuit extends Component {

    static navigationOptions = {
        header: null,
        headerMode: 'none'
    }

    state = {
        circuits: [],
        isLogged: false,
        isConnected: false,
        updatePosition: true,
        menu: 'map',
        hasGPS: false,
        currentLocation:{
            latitude: 48.866667,
            longitude: 2.333333
        },
        mapLocation:{
            latitude: 48.866667,
            longitude: 2.333333,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00922
        },

    };


    async checkPermissions() {
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
                title: 'Activate location',
                message:
                    'Permits us to access to your location ',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );

        const status1 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Accessing Permission",
                message: "App needs access to your location"
            }
        );

        if (status === 'granted' && status1 === 'granted') {
            this.setState({ gpsAuth: true, isReady: true });
        } else {
            this.setState({ gpsAuth: false })
        }
    }

    fetchCircuits = () => {
        fetch(MOBILE_URL + '/courses/', {
            method: 'GET',
            headers: HEADERS
        })
        .then((response) => response.json())
        .then((res) => {
            this.setState({circuits: res})
            //this.checkDatabase(res);
        })
        .catch();
    };

    checkDatabase = (circuits) => {

        let db = new Datastore({ filename: 'PublicCirquizz' });
        // Load database, it's close when it's finished
        db.loadDatabase( async () => {

            //Removing all documents with the 'match-all' query
            //db.remove({}, { multi: true }, function (err, numRemoved) {
            //});

            circuits.map( async (circuit) => {
                try {
                    // collection
                    const collection = await db.findOneAsync({ id: circuit.id });
                    // if exist => update && else => insert
                    collection ? await db.updateAsync({id: circuit.id}, {...circuit}) : await db.insertAsync({...circuit});
                } catch (error) {
                    console.log(error);
                }
            });

            this.loadCicuits();
        });
    };

    loadCicuits = () =>{
        let db = new Datastore({ filename: 'PublicCirquizz' });

        db.loadDatabaseAsync( async () => {
            //Get all circuits from database
            try {
                const local_circuits = await db.findAsync({});
                this.setState({ circuits: local_circuits });
            } catch (error) {
                console.log(error);
            }
        })
    };

    getAllCircuits = async () => {

        // If user is conncted, fetch circuits
        if(this.state.isConnected){
            try {
                await this.fetchCircuits();
            } catch (error) {
                console.log(error)
            }
        } else {
            this.loadCicuits();
        }
    };

    handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected });
    };

    handlerGPSState = () =>{
        this.setState({updatePosition: true});
    };

    updateCircuits = (circuits) => {
        this.setState({circuits})
    };

    handleLocation = (latitude, longitude) => {
        this.setState((prevState) => {
            return {
                mapLocation: {
                    ...prevState.mapLocation,
                    latitude: latitude,
                    longitude: longitude
                },
            }
        });
    };

    centerByLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState((prevState) => {
                return {
                    mapLocation: {
                        ...prevState.mapLocation,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                }
            });
        }, () => {
            ToastAndroid.show('Merci d\'activer la géolocalisation', ToastAndroid.SHORT);
        });
    };

    onRegionChange = (region) => {
        this.setState({ mapLocation: region });
    };

    componentWillMount(){
        this.fetchCircuits();
        this.centerByLocation();
    }

    componentDidMount(){
        this.checkPermissions();
    }

    render() {
        return (
            this.state.circuits &&
            <Container>
                <CircuitMap
                    circuits={this.state.circuits}
                    location={this.state.mapLocation}
                    currentLocation={this.state.currentLocation}
                    navigation={this.props.navigation}
                    hasGPS={this.state.hasGPS}
                    update={this.updateCircuits}
                    onRegionChange={this.onRegionChange}
                    handleGPS={this.handlerGPSState}
                    handleLocation={this.handleLocation}
                />
            </Container>
        );
    }
}
