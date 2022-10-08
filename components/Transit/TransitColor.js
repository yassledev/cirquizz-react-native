import React, { Component } from 'react';
import {Body} from 'native-base';
import { MOBILE_URL, HEADERS } from '../../constants/Request';
import geolib from 'geolib';
import {Text} from "react-native";
import tinycolor from 'tinycolor2';

export default class TransitColor extends Component {


    state = {
        circuit: null,
        initDistance: null,
        distance: null,
        rouge : 255,
        bleu : 0,
        vert :0,
        couleur : '#FF0000',
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

    componentWillMount(){
        this.setState({initDistance: geolib.getDistanceSimple(this.props.location, {longitude: 7.736569, latitude: 48.530561})}); // latitude = this.state.circuit.step[0].latitude // longitude = this.state.circuit.step[0].longitude
        //this.fetchCircuits();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
            if (prevProps.location.latitude !== this.props.location.latitude || prevProps.location.longitude !== this.props.location.longitude) {

                this.setState({
                    distance : geolib.getDistanceSimple(this.props.location, {longitude: 7.736569, latitude: 48.530561}) // latitude = this.state.circuit.step[0].latitude // longitude = this.state.circuit.step[0].longitude
                });

                this.setState({
                    rouge : 255/this.state.initDistance * this.state.distance,
                    vert : 255/this.state.initDistance * (this.state.initDistance - this.state.distance),
                });
                if (this.state.rouge > 255) {
                    this.setState({rouge : 255});
                }

                if (this.state.vert > 255) {
                    this.setState({vert: 255});
                }

                const couleur = tinycolor({r: this.state.rouge, g: this.state.vert, b: 0}).toHexString();
                this.setState({couleur});
            }
    }

    render() {

        return (
            <>
                <Text >Raprochez vous du point (vert = proche) (rouge = éloigné)</Text>
                <Text>Distance : {this.state.distance} </Text>
                <Body style={{backgroundColor: this.state.couleur, width: 400}}>
                </Body>
            </>
        );
    }
}