import React, { Component } from 'react';

import {StyleSheet, View} from "react-native";
import {DialogComponent, DialogTitle} from "react-native-dialog-component";
import { Container, Radio, Fab, ListItem, Left, Right, Icon, Text, Button, Drawer, Content} from 'native-base';



export default class Filter extends Component {

    state = {
        arrayFiltreCircuitDuree: ["Court", "Moyen", "Long"],
        selectedFilter: -1,
        activeFilter: 'false'
    };

    handlerFilter = (id, longitude, latitude, rayon, longueur, duree) =>
    {
        const params = [longitude, latitude, rayon, longueur, duree];
        let url = 'https://cirquizz.cedricchavaudra.pro/api/mobile/courses?';
        let result = params.reduce((acc, cur, index) => {
            if(cur && id === 3) {
                return acc + ',' + cur;
            }
            else if(cur)
            {
                return cur
            }
            else {
                return acc;
            }
        });

        url = url + result;

        console.log(url);


        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                return this.setState({ circuits: res });
            })
            .catch((err) => {
                console.log(err)
            });
    };

    valideAnswer = () => {

    };

    submit = () =>{
        this.props.onSubmit(

        )
    };




    render() {

        return (
            <Content>
                <Text>Saluuuttt</Text>
            </Content>
            /*
            <Container>

                <Fab
                    active={this.props.activeFilter}
                    direction="down"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#5067FF' }}
                    position="topRight"
                    onPress={() => this.setState({activeFilter : !this.props.activeFilter})}>

                    <Icon type="FontAwesome" name="filter" />


                    <Button style={{ backgroundColor: '#a30008' }} onPress={ () => {this.dialogComponentFiltreDurree.show()}}>
                        <Icon name="user" />
                    </Button>

                    <Button style={{ backgroundColor: '#34A34F' }} onPress={() => this.handlerFilter(1, null,null,null, null, "duration=long")}>
                        <Icon name="timer" />
                    </Button>

                    <Button style={{ backgroundColor: '#3B5998' }} onPress={() => this.handlerFilter(2, null,null,null, "lengthMax=10", null)}>
                        <Icon name="walk" />
                    </Button>

                    <Button style={{ backgroundColor: '#DD5144' }} onPress={() => this.handlerFilter(3,"position=48.7156",7.260589999999979,1, null, null)}>
                        <Icon name="user" />
                    </Button>

                </Fab>

                <DialogComponent
                    title={<DialogTitle title="Filtre sur la durée du circuit" />}
                    ref={(dialogComponent) => { this.dialogComponentFiltreDurree = dialogComponent; }}>

                    {
                        this.state.arrayFiltreCircuitDuree.map((content, index) =>
                            <ListItem
                                onPress={() => this.setState({selectedAnswer: index })}
                                key={index}>
                                {
                                    <Radio
                                        selected={this.state.selectedAnswer === index}
                                    />
                                }
                                <Text>{content} </Text>
                            </ListItem>)
                    }

                </DialogComponent>
            </Container>
            */
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
    },

    container: {
        ...StyleSheet.absoluteFillObject,
        alignSelf: 'flex-end',
        marginTop: -5,
        position: 'absolute', // add if dont work with above
    }
});
