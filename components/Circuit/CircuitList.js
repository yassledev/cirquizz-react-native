import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';
import { Icon, Text } from 'native-base';
import I18n from "../../translations/i18n";
import CircuitFilter from './CircuitFilter'
let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");

export default class CircuitList extends Component {

    state = {
        error: '',
        circuits: [],
        location:{
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.9,
                longitudeDelta: 0.9
        },

        isModalVisible: false,
        noCircuit: false,
    };


    _renderHeader = (item) => {
        console.log(this.props.circuits);
        return (
            <View>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    {item.name}
                </Text>
            </View>
        );
    };
    _renderContent = (item) => {
        return (
            <View>
                <Text>  {I18n.t('distance')} {item.distance !== null ? (item.distance/1000).toFixed(2) : "0"} Km</Text>
                <Text>  {I18n.t('duree')} {item.duration !== null ? moment.duration(parseInt(item.duration), 'seconds').format('H[h] m[m] s[s]') : "0"}</Text>
                <Text>  {I18n.t('denivele')} {item.ascent !== null ? "+" + Math.round(item.ascent) +"m / -" +Math.round(item.descent): "0"} m</Text>

            </View>

        );
    };

    returnFilter = () =>{
        return <CircuitFilter location={this.props.location} update={this.props.update} isModalVisible={this.state.isModalVisible} handlerModal={this.handlerModal}/>

    };

    handlerModal = () =>{
        this.setState({isModalVisible: !this.state.isModalVisible})
    };

    noCircuitHandler = () =>{
        console.log(this.props.circuits);
      if(this.props.circuits === "[]" || !this.props.circuits || this.props.circuits.length === 0)
      {
          console.log("dans le hanlder")
          return <Text>Il n'y a pas de circuits à afficher</Text>
      }
      else {
          console.log("pas hanlder")
      }
    };

    onTapInfoCircuit = (content) => {
        this.props.navigation.navigate('CircuitDetail', {id : content.id, navigation: this.props.navigation})
    };

    render() {
        return (


            <>
                <CircuitFilter location={this.props.location} update={this.props.update}/>
                {
                    this.props.circuits && this.props.circuits.map((content, index) =>(
                        <View style={{marginLeft: 20, flexDirection: 'column'}} key={index}  onStartShouldSetResponder={() => this.onTapInfoCircuit(content)}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name="ios-arrow-forward"/>
                                <Text style={{paddingLeft: 5}}>{content.name}</Text>
                            </View>

                            <View style={{marginLeft: 5, flexDirection: 'row'}}>
                                <View style={{backgroundColor: 'white', borderRadius: 4, borderWidth: 2}}><Text style={{fontSize: 10}}> <Icon style={{color: '#8D8D8D'}} name="timer" icon="timer"/> {content.distance !== null ? (content.distance/1000).toFixed(2) : "0"} Km</Text></View>
                                <View style={{backgroundColor: 'white', borderRadius: 4, borderWidth: 2, marginLeft: 4, paddingRight: 2}}><Text style={{fontSize: 10}}> <Icon style={{color: '#8D8D8D'}} name="walk" icon={"walk"}/>{content.duration !== null ? moment.duration(parseInt(content.duration), 'seconds').format('H[h] m[m] s[s]') : "0"}</Text></View>
                                <View style={{backgroundColor: 'white', borderRadius: 4, borderWidth: 2, marginLeft: 4, paddingRight: 2}}><Text style={{fontSize: 10}}> <Icon style={{color: '#8D8D8D'}} name="ios-trending-up" icon="ios-trending-up"/> {content.ascent !== null ? "+" + Math.round(content.ascent) +"m / -" +Math.round(content.descent): "0"} m</Text></View>
                            </View>
                        </View>
                    ))
                }
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
    arrowIconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        position: "absolute"
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
    }
});
/*
                <Content padder style={{ backgroundColor: "white" }}>
                    <Accordion
                        dataArray={this.props.circuits}
                        animation={true}
                        expanded={true}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                    />
                </Content>

                 */