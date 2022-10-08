import React, { Component } from 'react';
import {
    Text,
    Card,
    Button,
} from 'native-base';
import {StyleSheet, View, ScrollView} from "react-native";
import * as geolib from 'geolib'
import {CircuitListItem} from "./CircuitListItem";
import I18n from "../../translations/i18n";
let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

export default class CircuitMapList extends Component {

    state = {
        circuit : null,
        exist: false,
        downloaded_circuit: null,
        showLoading: false,
        dataArray:[{
            title: null,
            content: null
        }],
        isFilterActive: false,
        circuits : null,
        time: null,
    };

    onTapInfoCircuit = (content) => {
        this.props.navigation.navigate('Description', {circuit: content, id : content.id, latitude: content.latitude, longitude: content.longitude, title: content.name})
        //this.props.navigation.navigate('IntermediateStart', {circuit: content, id : content.id, latitude: content.latitude, longitude: content.longitude})
    };

    isPointInside = (content) =>{
        return geolib.isPointInPolygon({latitude: content.latitude, longitude: content.longitude}, [
            { latitude: this.props.location.latitude+(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude-(this.props.location.longitudeDelta/2)},
            { latitude: this.props.location.latitude+(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude+(this.props.location.longitudeDelta/2)},
            { latitude: this.props.location.latitude-(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude+(this.props.location.longitudeDelta/2)},
            { latitude: this.props.location.latitude-(this.props.location.latitudeDelta/2), longitude: this.props.location.longitude-(this.props.location.longitudeDelta/2)},
        ]);

        /*return geolib.isPointInside({
          latitude: content.latitude,
          longitude: content.longitude
        },[
            {
                latitude: bounds.getNorthWest().lat,
                longitude: bounds.getNorthWest().lng,
            },
            {
                latitude: bounds.getNorthEast().lat,
                longitude: bounds.getNorthEast().lng,
            },
            {
                latitude: bounds.getSouthEast().lat,
                longitude: bounds.getSouthEast().lng,
            },
            {
                latitude: bounds.getSouthWest().lat,
                longitude: bounds.getSouthWest().lng,
            }
      ]);*/

    };

    centerPointOnMap = (circuit) => {
        this.props.handleLocation(circuit.latitude, circuit.longitude);
        this.props.handleMarkerClick(circuit.latitude, circuit.longitude, circuit.id)
    };

    render() {
        return (
            <Card transparent="true">
                {/*<View style={{alignItems: 'center'}}>
                    <Octicons name="dash" color='grey' size={28}/>
                </View>*/}
                <View style={{flexDirection:'row',justifyContent: 'center', alignContent:'center',alignItems: 'center'}}>
                    <Text style={{color:'#346086', fontWeight:'bold'}}>{I18n.t('circuitsSecteur')}</Text>
                    <Text style={{color:'#346086', backgroundColor:'#5ff8c3',borderRadius:5, padding:4}}>{this.props.nbrCircuits}</Text>
                    {/*<View style={{flex: 1}}>*/}
                        <Button transparent title={"filters"} style={{padding:2,borderRadius:10, backgroundColor:'white',borderWidth: 1, borderColor: '#3d5484', marginLeft: 'auto'}} onPress={this.props.handleIsFilterActive}>
                            <Text style={{margin:0,color: '#3d5484',fontWeight:'bold'}}>●</Text>
                            <Text style={{margin:0,color: '#3d5484',fontWeight:'bold'}}>{I18n.t('filtre')}</Text>
                            {/*<Text style={{color: 'black', borderRadius: 40, backgroundColor: 'green'}}>{this.props.nbrFilter}</Text>*/}
                        </Button>
                    {/*</View>*/}
                </View>

                <ScrollView style={{backgroundColor: 'white'}}>
                    {
                        this.props.circuits && this.props.circuits.filter((circuit) => {
                            return this.isPointInside(circuit)
                        }).map((circuit) =>(
                            <CircuitListItem circuit={circuit} key={circuit.id} onPress={() => this.centerPointOnMap(circuit)} handleNextBtnPress={() => this.onTapInfoCircuit(circuit)} selected={this.props.index === circuit.id}/>
                        ))
                    }
                </ScrollView>
            </Card>
        )
    };
};

const styles = StyleSheet.create({
    bottom: {
        backgroundColor: 'red'
    },
    dimensions: {
        position: 'absolute',
        width: '100%',
        height: '50%'
    },
    map :{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'column',
        flex: 1,
        position: "absolute"
    },
    image:{
        width: 30,
        height: 30
    }
});

/*
         {this.props.selectedCircuit ? (
              <ScrollView style={{ backgroundColor: "white" }}>
                <Card transparent="true">
                  {this.props.circuits &&
                    this.props.circuits.map((content, index) =>
                      this.isPointInPolygon(content) &&
                      this.props.index ===
                        this.props.circuits[index].id ? (
                        <CardItem
                          key={index}
                          style={{ backgroundColor: "#8D8D8D" }}
                          bordered
                        >
                          <Body
                            style={{
                              alignItems: "center",
                              flex: 1,
                              flexDirection: "row"
                            }}
                          >
                            <Image
                              style={styles.image}
                              source={require("../../assets/lettre_c.jpg")}
                            />
                            <View
                              style={{ flexDirection: "row", flex: 1 }}
                            >
                              <View
                                style={{
                                  marginLeft: 10,
                                  flexDirection: "column"
                                }}
                                key={index}
                              >
                                <Text style={{ paddingLeft: 5 }}>
                                  {content.name}
                                </Text>
                                <View
                                  style={{
                                    marginLeft: 5,
                                    flexDirection: "row",
                                    alignItems: "center"
                                  }}
                                >
                                  <View
                                    style={{
                                      alignItems: "center",
                                      flexDirection: "row"
                                    }}
                                  >
                                    <Image
                                      source={require("../../assets/Icon-distance.png")}
                                    />
                                    <Text style={{ fontSize: 13 }}>
                                      {" "}
                                      {content.distance !== null
                                        ? (
                                            content.distance / 1000
                                          ).toFixed(2)
                                        : "0"}{" "}
                                      Km
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      alignItems: "center",
                                      marginLeft: 4,
                                      paddingRight: 2,
                                      flexDirection: "row"
                                    }}
                                  >
                                    <Image
                                      source={require("../../assets/Icon-time.png")}
                                    />
                                    <Text style={{ fontSize: 13 }}>
                                      {" "}
                                      {content.duration !== null
                                        ? moment
                                            .duration(
                                              parseInt(
                                                content.duration
                                              ),
                                              "seconds"
                                            )
                                            .format("H[h] m[m] s[s]")
                                        : "0"}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      alignItems: "center",
                                      marginLeft: 4,
                                      paddingRight: 2,
                                      flexDirection: "row"
                                    }}
                                  >
                                    <Image
                                      source={require("../../assets/Icon-elevation.png")}
                                    />
                                    <Text style={{ fontSize: 13 }}>
                                      {" "}
                                      {content.ascent !== null
                                        ? "+" +
                                          Math.round(content.ascent) +
                                          "m / -" +
                                          Math.round(content.descent)
                                        : "0"}{" "}
                                      m
                                    </Text>
                                  </View>
                                  {content.stars ? (
                                    <View
                                      style={{
                                        alignItems: "center",
                                        marginLeft: 4,
                                        paddingRight: 2,
                                        flexDirection: "row"
                                      }}
                                    >
                                      <MaterialIcons
                                        name="star"
                                        size={30}
                                        color="black"
                                      />
                                      <Text>{content.stars}</Text>
                                    </View>
                                  ) : (
                                    <></>
                                  )}
                                </View>
                              </View>
                              <Button
                                style={{
                                  marginLeft: "auto",
                                  backgroundColor: "white"
                                }}
                                onPress={() =>
                                  this.onTapInfoCircuit(content)
                                }
                              >
                                <MaterialIcons
                                  name="keyboard-arrow-right"
                                  size={30}
                                  color="black"
                                />
                              </Button>
                            </View>
                          </Body>
                        </CardItem>
                      ) : (
                        this.isPointInPolygon(content) && (
                          <CardItem key={index} bordered>
                            <Body
                              style={{
                                alignItems: "center",
                                flex: 1,
                                flexDirection: "row"
                              }}
                            >
                              <Image
                                style={styles.image}
                                source={require("../../assets/lettre_c.jpg")}
                              />
                              <View
                                style={{
                                  flexDirection: "row",
                                  flex: 1
                                }}
                              >
                                <View
                                  style={{
                                    marginLeft: 10,
                                    flexDirection: "column"
                                  }}
                                  key={index}
                                >
                                  <Text style={{ paddingLeft: 5 }}>
                                    {content.name}
                                  </Text>
                                  <View
                                    style={{
                                      marginLeft: 5,
                                      flexDirection: "row",
                                      alignItems: "center"
                                    }}
                                  >
                                    <View
                                      style={{
                                        alignItems: "center",
                                        flexDirection: "row"
                                      }}
                                    >
                                      <Image
                                        source={require("../../assets/Icon-distance.png")}
                                      />
                                      <Text style={{ fontSize: 13 }}>
                                        {" "}
                                        {content.distance !== null
                                          ? (
                                              content.distance / 1000
                                            ).toFixed(2)
                                          : "0"}{" "}
                                        Km
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        alignItems: "center",
                                        marginLeft: 4,
                                        paddingRight: 2,
                                        flexDirection: "row"
                                      }}
                                    >
                                      <Image
                                        source={require("../../assets/Icon-time.png")}
                                      />
                                      <Text style={{ fontSize: 13 }}>
                                        {" "}
                                        {content.duration !== null
                                          ? moment
                                              .duration(
                                                parseInt(
                                                  content.duration
                                                ),
                                                "seconds"
                                              )
                                              .format("H[h] m[m] s[s]")
                                          : "0"}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        alignItems: "center",
                                        marginLeft: 4,
                                        paddingRight: 2,
                                        flexDirection: "row"
                                      }}
                                    >
                                      <Image
                                        source={require("../../assets/Icon-elevation.png")}
                                      />
                                      <Text style={{ fontSize: 13 }}>
                                        {" "}
                                        {content.ascent !== null
                                          ? "+" +
                                            Math.round(content.ascent) +
                                            "m / -" +
                                            Math.round(content.descent)
                                          : "0"}{" "}
                                        m
                                      </Text>
                                    </View>
                                    {content.stars ? (
                                      <View
                                        style={{
                                          alignItems: "center",
                                          marginLeft: 4,
                                          paddingRight: 2,
                                          flexDirection: "row"
                                        }}
                                      >
                                        <MaterialIcons
                                          name="star"
                                          size={30}
                                          color="black"
                                        />
                                        <Text>{content.stars}</Text>
                                      </View>
                                    ) : (
                                      <></>
                                    )}
                                  </View>
                                </View>
                                <Button
                                  style={{
                                    marginLeft: "auto",
                                    backgroundColor: "white"
                                  }}
                                  onPress={() =>
                                    this.onTapInfoCircuit(content)
                                  }
                                >
                                  <MaterialIcons
                                    name="keyboard-arrow-right"
                                    size={30}
                                    color="black"
                                  />
                                </Button>
                              </View>
                            </Body>
                          </CardItem>
                        )
                      )
                    )}
                </Card>
              </ScrollView>
            ) : (
              <ScrollView>  
                  <Card transparent>
                  {
                     this.props.circuits.map((content, index)=> (
                         this.isPointInPolygon(content) &&
                                (<ListItemTest circuit={content} key={index} onPress={() => this.centerPointOnMap()} handleNextBtnPress={() => this.onTapInfoCircuit(content)} />)
                    ))
                  }
                  </Card>
              </ScrollView>
            )}





            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text>Circuits dans le secteur : {this.props.nbrCircuits}</Text>
                            <View style={{alignItems: 'center',  flexDirection: 'row', marginLeft: 'auto'}}>
                                {!this.props.disabledUp &&
                                <Button disabled={this.props.disabledUp} title={"up"} style={{backgroundColor: 'white'}} onPress={() => this.props.handlerHeightMultiplicator()}>
                                    <MaterialIcons name="keyboard-arrow-up" size={30} color="#8D8D8D"/>
                                </Button>
                                }
                                {!this.props.disabledDown &&
                                <Button disabled={this.props.disabledDown} title={"down"} style={{backgroundColor: 'white'}} onPress={() => this.props.handlerHeightDivisor()}>
                                    <MaterialIcons name="keyboard-arrow-down" size={30} color="#8D8D8D"/>
                                </Button>
                                }
                            </View>
                        </View>



















                                      {
                this.props.selectedCircuit ?
                    <Card transparent="true">
                        <View style={{alignItems: 'center'}}>
                            <Octicons name="dash" color='grey' size={28}/>
                        </View>


                        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 4}}>
                            <Text>Circuits dans le secteur : {this.props.nbrCircuits} </Text>
                            <View style={{flex: 1}}>
                                <Button title={"filters"} style={{alignItems: 'center', flexDirection: 'row', marginLeft: 'auto', backgroundColor: 'white', borderRadius:10}} onPress={() => this.props.handleIsFilterActive()}>
                                    <Text style={{color: 'black'}}>Filtres</Text>
                                    <Text style={{color: 'black', borderRadius: 40, backgroundColor: 'green'}}>{this.props.nbrFilter}</Text>
                                </Button>
                            </View>
                        </View>

                        <ScrollView style={{backgroundColor: 'white'}}>
                        {
                            this.props.circuits && this.props.circuits.map((content, index) =>(
                                this.isPointInside(content) && this.props.index === this.props.circuits[index].id ?
                                <CardItem key={index} style={{ backgroundColor: '#8D8D8D'}} bordered>
                                        <Body style={{ alignItems: 'center', flex: 1, flexDirection: 'row'}}>
                                            <Image style={styles.image} source={require('../../assets/lettre_c.jpg')}/>
                                            <View style={{flexDirection: 'row', flex: 1}}>
                                                <View style={{marginLeft: 10, flexDirection: 'column'}} key={index}>
                                                    <Text style={{paddingLeft: 5}}>{content.name}</Text>
                                                    <View style={{marginLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                                                        <View style={{alignItems: 'center',  flexDirection: 'row'}}><Image source={require('../../assets/Icon-distance.png')}/><Text style={{fontSize: 10}}> {content.distance !== null ? (content.distance/1000).toFixed(2) : "0"} Km</Text></View>
                                                        <View style={{alignItems: 'center', marginLeft: 4, paddingRight: 2,  flexDirection: 'row'}}><Image  source={require('../../assets/Icon-time2x.png')}/><Text style={{fontSize: 10}}> {content.duration !== null ? moment.duration(parseInt(content.duration), 'seconds').format('H[h] m[m] s[s]') : "0"}</Text></View>
                                                        <View style={{alignItems: 'center', marginLeft: 4, paddingRight: 2,  flexDirection: 'row'}}><Image  source={require('../../assets/Icon-elevation2x.png')}/><Text style={{fontSize: 10}}> {content.ascent !== null ? "+" + Math.round(content.ascent) +"m / -" +Math.round(content.descent): "0"} m</Text></View>
                                                        { content.stars ? <View style={{alignItems: 'center', marginLeft: 4, paddingRight: 2,  flexDirection: 'row'}}><MaterialIcons name="star" size={30} color='black'/><Text>{content.stars}</Text></View> : <></> }
                                                    </View>
                                                </View>
                                                <Button style={{marginLeft: 'auto', backgroundColor: 'white'}} onPress={() => this.onTapInfoCircuit(content)}>
                                                    <MaterialIcons name="keyboard-arrow-right" size={30} color="black"/>
                                                </Button>
                                            </View>
                                        </Body>
                                </CardItem>:

                                    this.isPointInside(content) && <CardItem key={index}  bordered>
                                        <Body style={{ alignItems: 'center', flex: 1, flexDirection: 'row'}}>
                                            <Image style={styles.image} source={require('../../assets/lettre_c.jpg')}/>
                                            <View style={{flexDirection: 'row', flex: 1}}>
                                                <View style={{marginLeft: 10, flexDirection: 'column'}} key={index}>
                                                    <Text style={{paddingLeft: 5}}>{content.name}</Text>
                                                    <View style={{marginLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                                                        <View style={{alignItems: 'center',  flexDirection: 'row'}}><Image source={require('../../assets/Icon-distance.png')}/><Text style={{fontSize: 10}}> {content.distance !== null ? (content.distance/1000).toFixed(2) : "0"} Km</Text></View>
                                                        <View style={{alignItems: 'center', marginLeft: 4, paddingRight: 2,  flexDirection: 'row'}}><Image  source={require('../../assets/Icon-time2x.png')}/><Text style={{fontSize: 10}}> {content.duration !== null ? moment.duration(parseInt(content.duration), 'seconds').format('H[h] m[m] s[s]') : "0"}</Text></View>
                                                        <View style={{alignItems: 'center', marginLeft: 4, paddingRight: 2,  flexDirection: 'row'}}><Image  source={require('../../assets/Icon-elevation2x.png')}/><Text style={{fontSize: 10}}> {content.ascent !== null ? "+" + Math.round(content.ascent) +"m / -" +Math.round(content.descent): "0"} m</Text></View>
                                                        { content.stars ? <View style={{alignItems: 'center', marginLeft: 4, paddingRight: 2,  flexDirection: 'row'}}><MaterialIcons name="star" size={30} color='black'/><Text>{content.stars}</Text></View> : <></> }
                                                    </View>
                                                </View>
                                                <Button style={{marginLeft: 'auto', backgroundColor: 'white'}} onPress={() => this.onTapInfoCircuit(content)}>
                                                    <MaterialIcons name="keyboard-arrow-right" size={30} color="black"/>
                                                </Button>
                                            </View>
                                        </Body>
                                    </CardItem>
                            ))
                        }
                        </ScrollView>
                    </Card>:



 */
