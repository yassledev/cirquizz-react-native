import React, {Component} from 'react';

import {Text, ListItem, Button, CheckBox} from 'native-base';
import {StyleSheet, View, WebView} from "react-native";
import HTMLView from 'react-native-htmlview';

let nbrReponse = 0;

export default class QcmMultiple extends Component {


    state = {
        allAnswers: [],
        userAnswers: [],
        isValidateHide: false,
        isNextHide: true,
        borderColor: [],
        borderWidth: 3,
        score: null,
        nbrTrueResponse: 0,
        goodAnswer: []
    };

    componentDidMount() {
        this.setState({
            allAnswers: this.props.question.answers.map((answer) => answer.is_true === true),
            userAnswers: this.props.question.answers.map(() => false),
            borderColor: this.props.question.answers.map(() => 'white'),
            goodAnswer: this.props.question.answers.map(() => ''),
        });
        nbrReponse = 0;
    }


    valideAnswer = () => {
        const points = this.props.question.pivot.points;
        const good = this.state.allAnswers.filter((answer) => answer === true).length;
        const score = this.state.allAnswers
            .reduce((acc, answer, index) => {
                if (
                    this.state.allAnswers.filter((answer, idx) => answer === false && this.state.userAnswers[idx] === true).length === 0 &&
                    answer === this.state.userAnswers[index] &&
                    answer === true
                ) {

                    return acc + points / good;
                } else {

                    return acc + 0;
                }
            }, 0);
        this.setState({score, isNextHide: false, isValidateHide: true});

        for(let i = 0; i < this.state.allAnswers.length; i++)
        {
            if(this.state.allAnswers[i] === true)
            {
                

                let tmpArrayGoodResponse = this.state.goodAnswer;
                tmpArrayGoodResponse[i] = "Bonne réponse";

                this.setState({
                    goodAnswer: tmpArrayGoodResponse
                });
            }
            else
            {
                
                let tmpArrayGoodResponse = this.state.goodAnswer;
                tmpArrayGoodResponse[i] = "Mauvaise réponse";


                this.setState({
                    goodAnswer: tmpArrayGoodResponse
                });
            }

            if (this.state.userAnswers[i] === this.state.allAnswers[i]){
                nbrReponse +=1;
            }
        }


        //this.props.onSubmit(score);

        //this.setState({isValidateHide: true, borderColor: 'red', borderWidth: 5})
    };

    nextStep = () =>{
        this.props.onSubmit(this.state.score);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.question !== this.props.question)
        {
            this.setState({
                isModalVisible: false,
                allAnswers: [],
                selectedAnswer: -1,
                isValidateHide: false,
                borderColor: 'white',
                borderWidth: 1,
                score: null,
                goodAnswer: []
            }, () => this.setState({allAnswers: this.props.question.answers.map((answer) => answer.is_true === true)}))
        }
    }

    skipAnswer = () =>{
        this.props.onSubmit(0)
    };

    handleCheckBox(e, index) {
        this.setState((prevState) => {
            return {
                userAnswers: prevState.userAnswers.map((answer, idx) => idx === index ? !answer : answer)
            }
        });
    }

    render() {

        return (
            <View>
                <HTMLView
                    value={this.props.question.translations[this.props.translation].question}
                />

                {
                    this.props.question.answers.map((q, index) =>
                        <ListItem disabled={!this.state.isNextHide} style={{marginTop: 5, marginRight: 10}} button onPress={(e) => this.handleCheckBox(e, index)} key={index}>

                            <CheckBox checked={this.state.userAnswers[index]}/>
                            <Text> {q.translations[this.props.translation].answer}</Text>

                            {this.state.isValidateHide? this.state.allAnswers[index] === this.state.userAnswers[index] ? <Text style={{color: 'green', marginLeft: 'auto'}}>Bonne réponse</Text> : <Text style={{color: 'red', marginLeft: 'auto'}}>Mauvaise réponse</Text> : <></>}
                        </ListItem>
                    )
                }

                {!this.state.isNextHide ?  <Text style={{marginTop: 5}}>{nbrReponse} réponse(s) juste(s) sur {this.state.allAnswers.length}</Text> : <></>}

                <View style={styles.bottom}>
                    <Button disabled={this.state.isValidateHide} rounded block onPress={this.skipAnswer} style={{ backgroundColor: "grey" }} >
                        <Text>Passer</Text>
                    </Button>
                    <Button disabled={this.state.isValidateHide} rounded block
                            onPress={this.valideAnswer}>
                        <Text> Soumettre </Text>
                    </Button>
                    {!this.state.isNextHide &&<Button disabled={this.state.isNextHide} rounded block
                            onPress={this.nextStep}>
                        <Text> Suivant </Text>
                    </Button>}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottom: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },

});

/*
                <Text> {this.props.question.translations[this.props.translation].question}</Text>


                <WebView
                    originWhitelist={['*']}
                    automaticallyAdjustContentInsets={false}
                    source={{html: this.props.question.translations[this.props.translation].question}}
                />

 */