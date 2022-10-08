import React, { Component } from 'react';
import { MOBILE_URL, HEADERS } from '../../constants/Request';
import {Text, View, ScrollView} from "react-native";
import tinycolor from 'tinycolor2';
import Speedometer from 'react-native-speedometer-chart';
import I18n from '../../translations/i18n';

export default class TransitDirection extends Component {


    state = {
        circuit : null,
        couleur : '#0000FF',
        angle : 90,
        indication : I18n.t('N')
    };

    fetchCircuits = (props) => {
        const id_circuit  = props.circuit.id;

        fetch(MOBILE_URL + '/courses/' + id_circuit + '/download', {
            method: 'GET',
            headers: HEADERS
        })
            .then((response) => this.setState({circuit : response.json()}))
            .catch();
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.latitude !== this.props.location.latitude || prevProps.location.longitude !== this.props.location.longitude) {
            const A =[prevProps.location.latitude, prevProps.location.longitude];
            const B =[48.530561, 7.736569]; // latitude = this.state.circuit.step[0].latitude // longitude = this.state.circuit.step[0].longitude
            const C =[this.props.location.latitude, this.props.location.longitude];

            const result = (((B[0]-A[0])*(C[0]-A[0])) + ((B[1]-A[1])*(C[1]-A[1]))) /
                (Math.sqrt(Math.pow(B[0]-A[0], 2) + Math.pow(B[1]-A[1], 2) ) * Math.sqrt(Math.pow(C[0]-A[0], 2) + Math.pow(C[1]-A[1], 2) ));

            let sta ={
                indication : I18n.t('N'),
                rouge : 0,
                vert : 0,
                bleu : 255,
            };

            if (result > 0.2) {
                if (result > 0.7) {
                    sta = {
                        indication : I18n.t('TB'),
                        rouge : 0,
                        vert : result * 255,
                        bleu : 255 - (result * 255),
                    };
                }
                else {
                    sta = {
                        indication : I18n.t('B'),
                        rouge : 0,
                        vert : result * 255,
                        bleu : 255 - (result * 255),
                    };
                }
            }
            else if (result < -0.2) {
                if (result < -0.7) {
                    sta = {
                        indication : I18n.t('TM'),
                        rouge : (- result) * 255,
                        vert : 0,
                        bleu : 255 + (result * 255),
                    };
                }
                else {
                    sta = {
                        indication : I18n.t('M'),
                        rouge : (- result) * 255,
                        vert : 0,
                        bleu : 255 + (result * 255),
                    };
                }

            }
            else {
                sta ={
                    indication : I18n.t('N'),
                    rouge : 0,
                    vert : 0,
                    bleu : 255,
                };
            }
            const angle = (result + 1) * 90;
            const couleur = tinycolor({r: sta.rouge, g: sta.vert, b: sta.bleu}).toHexString();
            this.setState( {couleur, angle, indication : sta.indication});
        }
    }

    componentWillMount(){
        //this.fetchCircuits();
    }

    render() {

        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <ScrollView style={{flex: 5, flexDirection: 'column'}}>
                    <Text >{I18n.t('indicBonneDir')} </Text>
                    <Text >{I18n.t('explicationDirection')}</Text>
                </ScrollView>
                <View style={{flex: 3, flexDirection: 'column'}}>
                    <View style={{alignItems: 'center'}}>
                        <Speedometer value={this.state.angle / 180 * 100} totalValue={100} showIndicator internalColor={this.state.couleur} textStyle={{ color: this.state.couleur }} size={325} text={this.state.indication} showText />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{flex : 1, textAlign: 'center'}}>{I18n.t('MD')}</Text>
                        <Text style={{flex : 1, textAlign: 'center'}}>{I18n.t('BD')}</Text>
                    </View>
                </View>
            </View>
        );
    }
}