import React, { Component } from 'react';
import {StyleSheet, Alert, Dimensions, Text} from 'react-native';
import MapView, {UrlTile, Marker} from 'react-native-maps';
import {Container, View, Button} from 'native-base';
import CircuitBaseInfo from './CircuitBaseInfo';
import CircuitMapList from './CircuitMapList'
import CircuitFilterContent from './CircuitFilterContent'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons'
import * as geolib from 'geolib';
import debounce from 'lodash/debounce';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SvgUri from 'react-native-svg-uri';



export default class CircuitMap extends Component {

    state = {
        selectedCircuit: null,
        isMapClicked: false,
        latitude: null,
        longitude: null,
        indexMarker: null,
        height: Dimensions.get('window').height/3,
        heightBase : Dimensions.get('window').height/6,
        disabledUp: false,
        disabledDown: true,
        arrayMarkers: [],
        active: 'false',
        nbrFilter: 0,
        dataFilter: {
            duration: [null, null],
            elevation: [null, null],
            length: [null, null],
            stars:[null, null],
            name: null,
            position: null
        },
        isFilterActive: false,
        arrayFilter: [false, false, false, false, false, false],
        arrayDislplayFilter: null,
    };

    handlerMap = () => {
        this.setState({selectedCircuit: null})
    };

    playGame = (version) => {
        this.props.navigate.navigate('Game', {version});
    };

    async componentWillMount() {
        let tmpArray = this.props.circuits.map(() => false);
        console.log("Length : "+ tmpArray.length);
        this.setState({arrayMarkers: tmpArray})
    };


    onTapInfoCircuit = () => {
        this.props.navigation.navigate('Description', {id : this.state.selectedCircuit.id, navigation: this.props.navigation, latitude: 0, longitude: 0, title: this.state.selectedCircuit.name})
    };

    onTapInfoCircuit2 = () => {
        this.props.navigation.navigate('CircuitDetail', {id : this.state.selectedCircuit.id, navigation: this.props.navigation})
    };

    renderDescription = () =>{
        if(this.state.selectedCircuit)
        {
            return  <View style={styles.bottom}  onStartShouldSetResponder={this.onTapInfoCircuit}>

                <CircuitBaseInfo selectedCircuit={this.state.selectedCircuit}
                                 navigation={this.props.navigation}
                                 onTap={() => this.onTapInfoCircuit()}
                />
            </View>
        }
    };

    handlerHeightMultiplicator = (value) =>{
        console.log("Dans la multiplication");
        this.setState({height: this.state.height*2, disabledUp: !this.state.disabledUp, disabledDown: !this.state.disabledDown})
    };

    handlerHeightDivisor = (value) =>{
        console.log("Dans la division");
        this.setState({height: this.state.height/2, disabledDown: !this.state.disabledDown, disabledUp: !this.state.disabledUp})
    };

    handleMarkerClick = (latitude, longitude, index) =>{
        this.setState({latitude, longitude, indexMarker: index})
    };

    isPointInPolygon = (content, index) =>{
        let result = geolib.isPointInPolygon({latitude: content.latitude, longitude: content.longitude}, [
            { latitude: this.props.location.latitude+(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude-(this.props.location.longitudeDelta/2)},
            { latitude: this.props.location.latitude+(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude+(this.props.location.longitudeDelta/2)},
            { latitude: this.props.location.latitude-(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude+(this.props.location.longitudeDelta/2)},
            { latitude: this.props.location.latitude-(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude-(this.props.location.longitudeDelta/2)},
        ]);
        let tmpArray = this.state.arrayMarkers;
        tmpArray[index] = result;
    };

    handleDisableUp = () =>{
        this.setState({disabledUp: !this.state.disabledUp})
    };

    handleDisableDown = () =>{
        this.setState({disabledDown: !this.state.disabledDown})
    };


    handleIsFilterActive = () => {
        this.setState({isFilterActive: !this.state.isFilterActive})
    };


    renderListCircuit = () => {

        let nbrCircuits = this.props.circuits
            .map((circuit) =>
                geolib.isPointInPolygon({latitude: circuit.latitude, longitude: circuit.longitude}, [
                    { latitude: this.props.location.latitude+(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude-(this.props.location.longitudeDelta/2)},
                    { latitude: this.props.location.latitude+(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude+(this.props.location.longitudeDelta/2)},
                    { latitude: this.props.location.latitude-(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude+(this.props.location.longitudeDelta/2)},
                    { latitude: this.props.location.latitude-(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude-(this.props.location.longitudeDelta/2)},
                ])
            )
            .reduce((nb, v) => nb + (v ? 1 : 0), 0);

        let nbrFilterTmp = Object.keys(this.state.dataFilter)
            .reduce((nb, filter) => {
                const value = this.state.dataFilter[filter];
                if (value && value !== '' && value[0] !== null && value[1] !== null) {
                    return nb+1;
                } else {
                    return nb;
                }
            }, 0);

        console.log("On include");
        return <>
            {
                this.contentFilter()
            }
            {
                this.renderFilters()
            }
            <View style={ {height: this.state.height, marginBottom: 50}}>
                <CircuitMapList
                    selectedCircuit={this.state.selectedCircuit}
                    circuits={this.props.circuits}
                    navigation={this.props.navigation}
                    location={this.props.location}
                    index={this.state.indexMarker}
                    disabledUp={this.state.disabledUp}
                    disabledDown={this.state.disabledDown}
                    height={this.state.height}
                    nbrCircuits={nbrCircuits}
                    nbrFilter={nbrFilterTmp}
                    dataFilter={this.state.dataFilter}
                    arrayFilter={this.state.arrayFilter}
                    currentLocation={this.props.currentLocation}
                    handlerFilter={this.handlerFilter}
                    handlerTrash={this.handlerTrash}
                    handleChangeText={this.handleChangeText}
                    handleChange={this.handleChange}
                    handlerHeightMultiplicator={this.handlerHeightMultiplicator}
                    handlerHeightDivisor={this.handlerHeightDivisor}
                    handleDisableUp={this.handleDisableUp}
                    handleDisableDown={this.handleDisableDown}
                    handleIsFilterActive={this.handleIsFilterActive}
                    handleLocation={this.props.handleLocation}
                    handleMarkerClick={this.handleMarkerClick}

                />
            </View>
            </>

    };

    handlerFilter = (index) =>
    {
        let tmpArray = this.state.arrayFilter;

        tmpArray[index] = !this.state.arrayFilter[index];

        for(let i = 0; i< tmpArray.length; i++)
        {
            if(i !== index)
            {
                tmpArray[i] = false;
            }
        }

        /*
        if(!this.state.disabledUp)
        {
            this.setState({height: this.state.height*2, disabledUp: !this.state.disabledUp, disabledDown: !this.state.disabledDown})
        }else {
            this.setState({height: this.state.height/2, disabledUp: !this.state.disabledUp, disabledDown: !this.state.disabledDown})
        }

         */


        this.setState({arrayFilter: tmpArray})
    };

    filterCourses = () => {
        const filters = Object.keys(this.state.dataFilter).map((filter) => {
            const value = this.state.dataFilter[filter];
            if(value && value !== '' && value[0] !== null && value[1] !== null ) {
                if(filter==="name" || filter==="position") {
                    return `${filter}=${value}`
                } else {
                    return `${filter}Min=${value[0]}&${filter}Max=${value[1]}`;
                }
            }
        });

        const url = `https://cirquizz.cedricchavaudra.pro/api/mobile/courses?${filters.join('&')}`;

        console.log("url filter : "+url);

        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
            .then((courses) => {
                //console.log(courses);
                return this.props.update(courses);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    handleChange = (content, name) => {

        console.log("content"+ content);
        console.log("content"+ name);
        this.setState((prevState) => {
            return {
                dataFilter: {
                    ...prevState.dataFilter,
                    [name]: content
                }
            };
        }, () => this.filterCourses());
    };



    handleChangeText = (content, name) => {
        console.log(content,name);

        if(content === '')
        {
            console.log("null content"+content);
            this.setState((prevState) => {
                return {
                    dataFilter: {
                        ...prevState.dataFilter,
                        [name]: null
                    }
                };
            }, this.debouncedFilterCourses);
        }
        else
        {
            this.setState((prevState) => {
                return {
                    dataFilter: {
                        ...prevState.dataFilter,
                        [name]: content
                    }
                };
            }, this.debouncedFilterCourses);
        }

    };

    debouncedFilterCourses = debounce(this.filterCourses, 1000);

    handlerTrash = (id, name) =>
    {
        if(id === null)
        {
            this.setState({
                dataFilter:{
                    duration: [null, null],
                    elevation: [null, null],
                    length: [null, null],
                    stars:[null, null],
                    name: null,
                    position: null
                }
            }, this.filterCourses)

        }
    };

    contentFilter = () =>{
        return <CircuitFilterContent currentLocation={this.props.currentLocation} dataFilter={this.state.dataFilter} arrayFilter={this.state.arrayFilter} handleChangeText={this.handleChangeText} handleChange={this.handleChange} isFilterActive={this.state.isFilterActive}/>
    };


    renderFilters = ()  =>
    {
        return this.state.isFilterActive && <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
            <Button style={{backgroundColor: 'white'}} onPress={() => {this.handlerFilter(0)}}>
                {!this.state.arrayFilter[0] ?<MaterialIcons name="timer" size={28} color="#8D8D8D"/>:<MaterialIcons name="timer" size={28} color='#013a81'/>}
            </Button>

            <Button style={{backgroundColor: 'white'}} onPress={() => this.handlerFilter(1)}>
                {!this.state.arrayFilter[1] ?<MaterialIcons name="directions-walk" size={28} color="#8D8D8D"/>:<MaterialIcons name="directions-walk" size={28} color='#013a81'/>}
            </Button>

            <Button style={{backgroundColor: 'white'}} onPress={() => this.handlerFilter(2)}>
                {!this.state.arrayFilter[2] ?<MaterialCommunityIcons name="map-marker-radius" size={28} color="#8D8D8D"/>:<MaterialCommunityIcons name="radius" size={28} color='#013a81'/>}
            </Button>

            <Button  style={{backgroundColor: 'white'}} onPress={() => this.handlerFilter(3)}>
                {!this.state.arrayFilter[3] ?<MaterialCommunityIcons name="elevation-rise" size={28} color="#8D8D8D"/>:<MaterialCommunityIcons name="elevation-rise" size={28} color='#013a81'/>}
            </Button>


            <Button style={{backgroundColor: 'white'}} onPress={() => this.handlerFilter(4)}>
                {!this.state.arrayFilter[4] ?<MaterialIcons name="star" size={28} color="#8D8D8D"/>:<MaterialIcons name="star" size={28} color='#013a81'/>}
            </Button>

            <Button style={{backgroundColor: 'white'}} onPress={() => this.handlerFilter(5)}>
                {!this.state.arrayFilter[5] ?<MaterialIcons name="search" size={28} color="#8D8D8D"/>:<MaterialIcons name="search" size={28} color='#013a81'/>}
            </Button>

            <Button style={{ backgroundColor: '#DD5144' }} onPress={() => this.handlerTrash(null)}>
                <SvgUri
                    width="30"
                    height="30"
                    style={{color:'blue'}}
                    source={require("../../assets/ios-trash.png")}
                />
            </Button>
        </View>
    };

    render() {
        return (
            <>
                <Container>
                    <MapView
                        style={{flex:1}}
                        showsUserLocation
                        loadingEnabled
                        initialRegion={this.props.location}
                        region={this.props.location}
                        onRegionChangeComplete={this.props.onRegionChange}
                        mapType="none"
                        onPress={() => {if(this.state.selectedCircuit){ this.setState({selectedCircuit: null, indexMarker: null})}}}
                    >

                        <UrlTile
                            urlTemplate="https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                        />

                        {this.props.circuits.map((circuit, index) =>
                            <Marker
                                title={circuit.name}
                                key={index}
                                onPress={() => this.setState({selectedCircuit: null}, () => {this.setState({selectedCircuit: circuit}, () =>{this.props.handleLocation(circuit.latitude, circuit.longitude); this.handleMarkerClick(circuit.latitude, circuit.longitude, circuit.id)})})}
                                coordinate={{
                                    latitude: circuit.latitude,
                                    longitude: circuit.longitude
                                }} />
                        )}
                    </MapView>
                </Container>
                {this.renderListCircuit()}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottom :{
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
    },
    map :{
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: "absolute"
    },

      button: {
          borderRadius: 4,
          padding: 10,
          marginLeft: 10,
          marginRight: 10,
          backgroundColor: '#ccc',
          borderColor: '#333',
          borderWidth: 1,
      },

    customView:{
        width: 20,
        height: 20
    },

    container2: {
        ...StyleSheet.absoluteFillObject,
        alignSelf: 'flex-end',
        marginTop: -5,
        position: 'absolute', // add if dont work with above
    },

    TouchableOpacityStyle: {
        position:'absolute',
        top:0,
        alignSelf:'flex-end'
    },

    FloatingButtonStyle: {
        width: 10,
        height: 10,
    },
});