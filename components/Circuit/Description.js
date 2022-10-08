import React, { Component } from 'react';
import { Text, Card, Body, CardItem, Button, Accordion, Container, Header, Content, List, ListItem } from 'native-base';
import {StyleSheet, View, ScrollView, Modal, WebView} from "react-native";
import { BASE_URL, MOBILE_URL, HEADER } from '../../constants/Request';
import Datastore from 'react-native-local-mongodb'
import WebViewDescr from "../WebView/WebViewDescr";

const db = new Datastore({ filename: 'Cirquizz' });


export default class Description extends Component {

    state = {
        circuit :  null,
        exist: false
    }

    getDetails = () => {
        fetch(MOBILE_URL + '/courses/' + this.props.circuit.id,{
            method: 'GET',
            headers: HEADER
        })
        .then((response) => response.json())
        .then((res) => {
            this.setState({ circuit: res });
            this.ifCircuitExist(res);
        })
        .catch((err) => {
            console.log(err)
        })
    }

    componentWillMount(){
        console.log(this.state.circuit, this.props.circuit);


        this.getDetails();
    };

    ifCircuitExist = (circuit) => {
        db.loadDatabase(async (err) =>  {  
            try {
               const collection = await db.findOneAsync({ id: circuit.id });

               if(collection){
                   this.setState({ exist: true })
               }
            } catch (error) {
                console.log(error);
            }
        });
    }

    downloadCircuit = (circuit) => {
        db.loadDatabase(async (err) =>  {  
            try {
                await db.insertAsync(circuit);
                this.setState({ exist: true })
            } catch (error) {
                console.log(error);
            }
        });
    }

    render() {
        if(this.state.circuit)
            return (
                <Card transparent="true">
                    <CardItem>
                        <Body>
                            <List>
                                <ListItem>
                                    <Text>Nom: {this.props.circuit.name}</Text>
                                </ListItem>
                                {this.props.isFull &&
                                    <WebViewDescr circuit={this.props.circuit}/>
                                }

                            </List>
                        </Body>
                    </CardItem>
                    <CardItem footer bordered>
                    {this.state.exist ?
                    <Button rounded block
                        onPress={this.props.selectCircuit}><Text>Jouer</Text>
                    </Button> :
                    <Button rounded block
                        onPress={() => this.downloadCircuit(this.state.circuit)}>
                        <Text>Télécharger le circuit</Text>
                        </Button>
                    }
                    </CardItem>
                </Card>
            )
        else
            return (
                <></>
            )
    }

};

const styles = StyleSheet.create({
    bottom: {
        backgroundColor: 'red'
    }
});
