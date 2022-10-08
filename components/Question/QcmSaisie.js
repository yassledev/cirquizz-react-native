import React, { Component } from 'react';

import { Text, Button } from 'native-base';
import {View} from "react-native";


export default class QcmSaisie extends Component {


    state = {
        isModalVisible: false,
        //validAnswers: [],
        selectedAnswer: null
    };

    valideAnswer(){

    }

    render() {

        return (
            <View>
                <Text> {this.props.question[this.props.translation].question }</Text>
                {
                    <input placeholder="Entrez votre réponse .."  />
                }

                <Button rounded block 
                onPress={() => this.valideAnswer()}>
                    <Text> Soumettre </Text>
                </Button>
            </View>
        );
    }
}