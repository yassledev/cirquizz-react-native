import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, StyleSheet, ScrollView} from 'react-native';
import { Button, Text, View, Container } from 'native-base';

import HTML from 'react-native-render-html';

const HEIGHT = Dimensions.get('window').height/2;
const WIDTH = Dimensions.get('window').width - 150;
export default class GameInstruction extends Component {

    render() {
        return (
            <>

                <View style={{height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                    <Text style={{fontSize: 20, color:'#346086', fontWeight: 'bold', marginBottom: 10, marginTop: 10}}>Instruction de l'étape : {this.props.etape+1} / {this.props.nbEtape}</Text>
                </View>
                <View style={{ borderBottomColor: '#346086', borderBottomWidth: 1, marginLeft: 50, marginRight: 50}}/>

                                
                <ScrollView style={{flex: 1, width: '90%', marginLeft: '5%'}}>
                    <HTML html={this.props.instruction} />
                </ScrollView>

                <View style={{ alignItems: 'center', justifyContent: 'center',paddingTop:60}}>
                    <Image source={require("../../assets/mask-bottom.png")} style={[ {position: 'absolute', top:0, left:0, right:0, width:'100%', resizeMode:'stretch', alignSelf: 'flex-end'}]}/>
                    <View style={{width: '90%', marginLeft: '5%'}}>
                        <Text style={{fontSize: 30, color:'#346086', fontWeight: 'bold', marginBottom: 20}}>Prêt(e) pour le QUIZZ?</Text>
                    </View>
                    <Button light full onPress={() => this.props.changeMenu('Navigation')}
                            style={{width: WIDTH, alignItems: 'center', justifyContent: 'center', borderRadius: 25,margin:30,marginTop:0,alignSelf:'center'}}>
                        <Text style={{fontWeight: 'bold'}}>C'est parti ! </Text>
                    </Button>
                </View>
            </>
        )
    }
}


const styles = StyleSheet.create({
    bottom: {
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        position: 'absolute'
    },
    bottom2: {
        left: 0,
        right: 0,
        bottom: 0,
        height: '70%',
        position: 'absolute'
    }
});