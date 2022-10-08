import * as React from 'react';
import {Text, View, CardItem, Icon, Button, Thumbnail, Right} from "native-base";
import {Image, StyleSheet} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome, { Icons } from 'react-native-fontawesome';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);


const renderStyle = (selected) =>{
    return {
        backgroundColor: selected ? '#a1fae3' : 'white'
    }
};
export const CircuitListItem = props => (
        <CardItem bordered style={(styles.specsText, renderStyle(props.selected))} button onPress={props.onPress}>
            {
                props.circuit.banner?
                <Thumbnail square source={{uri:  'https://cirquizz.cedricchavaudra.pro/storage/' + props.circuit.banner}}/> :
                <Thumbnail square source={require("../../assets/marker-cq_3x.png")}/>
            }
            <View style={{flex: 1}}>
                <Text style={{paddingLeft: 5, flex:1, color: '#346086'}}>{props.circuit.name}</Text>
                <View style={[{marginLeft: 5,flexDirection: "row",alignItems: "center",flex: 1}]}>
                    <View style={{alignItems: "center",flexDirection: "row"}}>
                        <Image source={require("../../assets/longueurCopy.png")}/>
                        <Text style={{fontSize: 13}}>
                            {" "}
                            {props.circuit.distance !== null
                                ? (props.circuit.distance / 1000).toFixed(2)
                                : "0"}{" "}
                            km
                        </Text>
                    </View>
                    <View style={{alignItems: "center",marginLeft: 4,paddingRight: 2,flexDirection: "row"}}>
                        <Image source={require("../../assets/Icon-time.png")}/>
                        <Text style={{fontSize: 13}}>
                            {" "}
                            {props.circuit.duration !== null
                                ? moment
                                    .duration(parseInt(props.circuit.duration), "seconds")
                                    .format(" " + "H[h] m[min]")
                                : "0"}
                        </Text>
                    </View>
                    <View style={{alignItems: "center",marginLeft: 4,paddingRight: 2,flexDirection: "row"}}>
                        <Image source={require("../../assets/Icon-elevation.png")}/>
                        <Text style={{fontSize: 13}}>
                            {" "}
                            {props.circuit.ascent !== null
                                ? "±" +
                                (Math.round(props.circuit.ascent) -
                                    Math.round(props.circuit.descent))
                                : "0"}{" "}
                            m
                        </Text>
                    </View>
                    {props.circuit.stars ? (
                        <View style={{alignItems: "center",marginLeft: 4,paddingRight: 2,flexDirection: "row"}}>
                            <Icon name="star" style={{color: "#354052",fontSize: 15,marginRight: 3}}/>
                            <Text style={{fontSize: 13}}>{props.circuit.stars}</Text>
                        </View>
                    ) : (
                        <></>
                    )}
                </View>

            </View>

            <Button transparent
                    style={{marginLeft: 'auto'}}
                //onPress={() => this.props.onTapInfoCircuit(props.circuit.content)}
                // onPress={() => alert("This is Card Header")}
                onPress={() => props.handleNextBtnPress()}>
                {/*<MaterialIcons
                    name="keyboard-arrow-right"
                    size={30}
                    color="black"
                />*/}
                <MaterialCommunityIcons name="arrow-right" size={28} color="#346086"/>
            </Button>
        </CardItem>
);
const styles = StyleSheet.create({
    bottom: {
        backgroundColor: "red"
    },
    dimensions: {
        position: "absolute",
        width: "100%",
        height: "50%"
    },
    map: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: "column",
        flex: 1,
        position: "absolute"
    },
    image: {
        width: 30,
        height: 30
    },
    specsText: {
        fontSize: 13,
        flex: 1
    },
    thumbnail: {
        height: 72,
        width: 72
    },
    cardItem: {
        // backgroundColor:'red',
        // paddingLeft:0,
        // paddingRight:0,
        // alignItems: "center",
        // flex: 1,
        // flexDirection: "row"
    },
});