import React, { Component } from 'react';
import {View, Text, ImageBackground, Image, Dimensions, StyleSheet} from "react-native";
import {Button, Body} from "native-base";
import FontAwesome, {Icons} from "react-native-fontawesome";
import {CircuitDescriptionHeader} from "./Description/CircuitDescriptionHeader";

const IntermediateStart = (props) => {
    
    const circuit = props.navigation.getParam("circuit");
    const version = props.navigation.getParam("version");

    const HEIGHT = Dimensions.get('window').height/3;
    const WIDTH = Dimensions.get('window').width - 150;
    return (
        <View style={{flex: 1}}>
            <View style={{flex: 1}}>
                <ImageBackground source={require("../../assets/mask-top.png")} style={{width: '100%', height: HEIGHT, position: 'absolute', zIndex: 1}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require("../../assets/dark_copy.png")}/>
                    </View>
                </ImageBackground>
                {circuit.banner ? 
                    <Image style={styles.bottom} source={{uri:  'https://cirquizz.cedricchavaudra.pro/storage/' + circuit.banner}} /> :
                    <Image style={styles.bottom} source={require("../../assets/team.jpg")}/>
                }
            </View>
            <Text>{circuit.banner}</Text>


            <View style={{flex: 1, backgroundColor:"#FFF"}}>

                {
                    circuit &&
                    <View style={{flex: 1}}>
                        <CircuitDescriptionHeader circuit={circuit}/>
                    </View>
                }

                <Image source={require("../../assets/mask-bottom.png")} style={[ {position: 'absolute' ,top:'100%',marginTop:'-50%', width: "100%", height: "100%", alignSelf: 'flex-end'}]}/>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 30, color:'#346086', fontWeight: 'bold', marginBottom: 20}}>Préparez-vous !</Text>
                    <Button light onPress={() => props.navigation.navigate("Game", {version: version})}
                            style={{width: WIDTH,alignSelf:'center', alignItems: 'center', justifyContent: 'center', borderRadius: 25}}>
                        <Text style={{fontWeight: 'bold'}}>Go</Text>
                    </Button>
                </View>

            </View>

        </View>

    );
}

const styles = StyleSheet.create({
    bottom: {
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        width: '100%',
        height: '60%',
        position: "absolute"
    },
    bottom2: {
        left: 0,
        right: 0,
        bottom: 0,
        height: '70%',
        position: 'absolute'
    }
});

export default IntermediateStart;

/*

            <View style={{flex: 1}}>
                <ImageBackground source={require("../../assets/mask-top.png")} style={{width: '100%', height: HEIGHT, flex: 1, alignItems: 'center', justifyContent: "center"}}/>
                {
                    circuit && <CircuitDescriptionHeader circuit={circuit} />
                }
                <ImageBackground source={require("../../assets/mask-bottom.png")} style={[styles.bottom, {width: "100%", height: HEIGHT, flex: 1, alignItems: 'center', justifyContent: "center"}]}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text>Préparez-vous !</Text>
                            <Button full onPress={() => props.navigation.navigate("Game", {version: version})}><Text>Go</Text></Button>
                    </View>
                </ImageBackground>
            </View>
 */