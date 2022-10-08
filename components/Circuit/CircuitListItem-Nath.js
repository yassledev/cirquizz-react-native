import React, { Component } from 'react';
import { Text, View, Card, CardItem, Body } from 'native-base';
import {Image, StyleSheet} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);
exports.CircuitListItem = (props) => (
    <View onStartShouldSetResponder={props.press}>
        <Card>
            <CardItem bordered>
                <Body style={{ alignItems: 'center', flex: 1, flexDirection: 'row'}}>
                    <Image style={{width: 72, height: 72}}
                           source={require('../../assets/lettre_c.jpg')}/>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{marginLeft: 10, flexDirection: 'column'}} >
                            <Text style={{paddingLeft: 5}}>{props.circuit.course.name}</Text>
                            <View style={{marginLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{alignItems: 'center',  flexDirection: 'row'}}><Image source={require('../../assets/Icon-distance.png')}/><Text style={{fontSize: 10}}> {props.circuit.distance !== null ? (props.circuit.distance/1000).toFixed(2) : "0"} Km</Text></View>
                                <View style={{alignItems: 'center', marginLeft: 4, paddingRight: 2,  flexDirection: 'row'}}><Image  source={require('../../assets/Icon-time.png')}/><Text style={{fontSize: 10}}> {props.circuit.duration !== null ? moment.duration(parseInt(props.circuit.duration), 'seconds').format('H[h] m[m] s[s]') : "0"}</Text></View>
                                <View style={{alignItems: 'center', marginLeft: 4, paddingRight: 2,  flexDirection: 'row'}}><Image  source={require('../../assets/Icon-elevation.png')}/><Text style={{fontSize: 10}}> {props.circuit.ascent !== null ? "+" + Math.round(props.circuit.ascent) +"m / -" +Math.round(props.circuit.descent): "0"} m</Text></View>
                                { props.circuit.stars ? <View style={{alignItems: 'center', marginLeft: 4, paddingRight: 2,  flexDirection: 'row'}}><MaterialIcons name="star" size={30} color='black'/><Text>{props.circuit.stars}</Text></View> : <></> }
                            </View>
                        </View>
                    </View>
                </Body>
            </CardItem>
        </Card>

    </View>

);

const styles = StyleSheet.create({
    image:{
        width: 30,
        height: 30
    }
});
