import React, { Component } from 'react';

import { Text, ListItem, Button, Radio } from 'native-base';
import {StyleSheet, View,  ScrollView, ImageBackground, Dimensions} from "react-native";
import HTMLView from "react-native-htmlview";
const WIDTH = Dimensions.get('window').width - 150;
const HEIGHT = Dimensions.get('window').height;
import HTML from 'react-native-render-html';

export default class QcmUnique extends Component {


    state = {
        isModalVisible: false,
        //validAnswers: [],
        allAnswers: [],
        selectedAnswer: -1,
        isValidateHide: false,
        borderColor: 'white',
        borderWidth: 1,
        score: null,
        goodAnswer: []
    };

    valideAnswer = () => {
        console.log(this.state.selectedAnswer);
        let good = false;
        const result = this.props.question.pivot.points;
        //console.log(result);
        if(this.state.selectedAnswer !== -1) {
            good = this.props.question.answers[this.state.selectedAnswer].is_true === true;
        }
        const score = good * result;
        this.setState({isValidateHide: true, borderColor: good ? 'green' : 'red', borderWidth: 5, score})
        

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
        }
    };

    submit = () =>{
        this.props.onSubmit(
                this.state.score
            )
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

    componentDidMount(){
        this.setState({allAnswers: this.props.question.answers.map((answer) => answer.is_true === true)});
        console.log(this.props.question);
    }



    getStyle = (valid, index, question) =>{
          if(!valid)
          {
              return styles.whiteClass
          }
          else {
              if(this.props.question.answers[this.state.selectedAnswer].is_true && this.state.selectedAnswer === index)
              {
                  return styles.greenClass
              }
              else {
                  if(question.is_true)
                  {
                      return styles.greenClass
                  }
                  else
                  {
                      if(this.state.selectedAnswer === index)
                      {
                          return styles.redClass
                      }
                      else {
                          return styles.whiteClass
                      }
                  }
              }
          }
    };

    render() {

        return (
            <ScrollView style={{flex: 1}}>

                    <HTML html={this.props.question.translations[this.props.translation].question}/>
                {
                    this.props.question.answers.map((q, index) =>
                        <ListItem button
                                  onPress={() => this.setState({selectedAnswer: index })}
                                  key={index} disabled={this.state.isValidateHide}>
                            {
                                <Radio
                                    selected={this.state.selectedAnswer === index}
                                />
                            }
                            <Text> {q.translations[this.props.translation].answer}</Text>
                            {this.state.goodAnswer[index] === "Bonne réponse" && this.state.goodAnswer[index] !== '' ? <Text style={{color: 'green', marginLeft: 'auto'}}>{this.state.goodAnswer[index]}</Text> : <Text style={{color: 'red', marginLeft: 'auto'}}>{this.state.goodAnswer[index]}</Text>}

                        </ListItem>
                    )
                }

                {
                    this.state.isValidateHide ?
                        <Button rounded block onPress={this.submit} style={{ backgroundColor: "grey" }} >
                            <Text>Passer à la suite</Text>
                        </Button>
                        :
                        <View style={styles.bottom}>
                            <Button rounded block onPress={this.submit} style={{ backgroundColor: "grey" }} >
                                <Text>Passer</Text>
                            </Button>
                            <Button rounded block
                                    onPress={this.valideAnswer}>
                                <Text> Soumettre </Text>
                            </Button>
                        </View>
                }
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    bottom: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    greenClass:{
        borderColor: 'green',
        borderWidth: 5
    },

    redClass:{
        borderColor: 'red',
        borderWidth: 5
    },

    whiteClass:{
        borderColor: 'white',
        borderWidth: 1
    }
});
