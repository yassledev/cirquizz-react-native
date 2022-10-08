import React, {Component} from 'react';
import {Dimensions, Image, ScrollView } from 'react-native';
import {Button, Text, View} from 'native-base';

import HTML from 'react-native-render-html';
const WIDTH = Dimensions.get('window').width - 150;

export default class GameStepDescription extends Component {

    render(){
        return (
            <>
                <View style={{height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                    <Text style={{fontSize: 20, color:'#346086', fontWeight: 'bold', marginBottom: 10, marginTop: 10}}>Description de l'étape : {this.props.etape+1} / {this.props.nbEtape}</Text>
                </View>
                <View style={{ borderBottomColor: '#346086', borderBottomWidth: 1, marginLeft: 50, marginRight: 50}}/>
                
                <ScrollView style={{flex: 1, width: '90%', marginLeft: '5%'}}>
                    <HTML html={this.props.description} />
                </ScrollView>

                <View style={{ alignItems: 'center', justifyContent: 'center',paddingTop:40,  marginTop: '-10%'}}>
                    <Image source={require("../../assets/mask-bottom.png")} style={[ {position: 'absolute', top:0, left:0, right:0, width:'100%', resizeMode:'stretch', alignSelf: 'flex-end'}]}/>
                    <View style={{width: '90%', marginLeft: '5%'}}>
                        <Text style={{fontSize: 26, color:'#346086', fontWeight: 'bold', marginBottom: 20}}>Prêt(e) pour la question ?</Text>
                    </View>
                    <Button light full onPress={() => this.props.next()}
                            style={{width: WIDTH, alignItems: 'center', justifyContent: 'center', borderRadius: 25,margin:30,marginTop:0,alignSelf:'center'}}>
                        <Text style={{fontWeight: 'bold'}}>C'est parti ! </Text>
                    </Button>
                </View>
            </>
        )
    }
}