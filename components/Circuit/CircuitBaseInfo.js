import React, { Component } from 'react';
import { Text, Card, Body, CardItem, Button, Container, Header, Content, List, Icon, ListItem, Spinner } from 'native-base';
import {AsyncStorage, StyleSheet, View, ScrollView, Modal, WebView, Dimensions} from "react-native";
import { BASE_URL, MOBILE_URL, HEADER, DB_CIRCUIT_DOWNLOADED, DB_GAME } from '../../constants/Request';
import Datastore from 'react-native-local-mongodb'
const db = new Datastore({ filename: 'Cirquizz' });
import HTML from 'react-native-render-html';
import I18n from "../../translations/i18n";

let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

export default class Description extends Component {

    state = {
        circuit : null,
        exist: false,
        downloaded_circuit: null,
        showLoading: false,
        dataArray:[{
            title: null,
            content: null
        }],
        fromage: null
    };


    getDetails = () => {

        fetch(MOBILE_URL + '/courses/' + this.props.selectedCircuit.id+ '/download',{
            method: 'GET',
            headers: HEADER
        })
        .then((response) => response.json())
        .then((res) => {

            let dataArray = [{
                title: res.course.name,
                content: res.course.description
            }];
            this.setState({ circuit :res, dataArray});
            this.ifCircuitExist(res);


        })
        .catch((err) => {
            console.log(err)
        })

    };


    checkDownloadedCircuit = async (circuit) => {
        const db = new Datastore({ filename: DB_CIRCUIT_DOWNLOADED });

        await db.loadDatabaseAsync(async (err) =>  {  
            try {
                // Removing all documents with the 'match-all' query
                //db.remove({}, { multi: true }, function (err, numRemoved) {
                //});
                // Check if circuit is already downloaded
                const collection = await db.findOneAsync({ id: this.props.selectedCircuit.id });
                this.setState({ downloaded_circuit: collection });
            } catch (error) {
                console.log(error);
            }
        });
    }

    downloadCircuit = () => {
        this.setState({ showLoading: true });
        fetch(MOBILE_URL + '/courses/' + this.props.selectedCircuit.id+ '/download',{
            method: 'GET',
            headers: HEADER
        })
        .then((response) => response.json())
        .then((res) => {
            this.insertDownloadedCircuit(res);
            //this.getFirstGame();
            this.setState({ showLoading: false });
        })
        .catch((err) => {
            console.log(err);
            this.setState({ showLoading: false });
        });

    };

    insertDownloadedCircuit = (circuit) => {
        let db = new Datastore({ filename: DB_CIRCUIT_DOWNLOADED });

        db.loadDatabase(async () => {
                // Find all documents in the collection

            await db.insertAsync({...circuit});            
            this.setState({ downloaded_circuit: circuit });
        });
    }

    getFirstGame = async () => {

        HEADER['Authorization'] = 'Bearer ' +   await AsyncStorage.getItem('@Cirquizz:token');
        console.log(HEADER)
        fetch(MOBILE_URL + '/games/start/' + this.props.selectedCircuit.id, {
            method: 'POST', 
            headers: HEADER
        })
        .then((response) => {
            //console.log(response);
            response.json()}
        )
        .then((res) => {
            this.insertDownloadedGame(res)
        });
    }


    insertDownloadedGame = async (game) => {
        let db = new Datastore({ filename: DB_GAME });

        await db.loadDatabaseAsync(async () => {
            //console.log(game);
        })
    }

    _renderHeader(item, expanded) {
        return (
            <View style={{
                flexDirection: "row",
                padding: 10,
                justifyContent: "space-between",
                alignItems: "center" ,
                backgroundColor: "#A9DAD6" }}>
                <Text style={{ fontWeight: "600" }}>
                    {" "}{item.title}
                </Text>
                {expanded
                    ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
                    : <Icon style={{ fontSize: 18 }} name="add-circle" />}
            </View>
        );
    }
    _renderContent(item) {
        return (
            <ScrollView style={{ flex: 1 }}>
                <HTML html={item.content} imagesMaxWidth={100} />
            </ScrollView>
        );
    }
    /*
    _renderHeader = () => {
        return (
            <View>
                <Text>SALUT</Text>
            </View>
        );
    };

    _renderContent = () => {
        return (
            <WebViewDescr circuit={this.state.circuit}/>
        );
    };
    */

    playGame = () => {
        this.props.navigation.navigate('Game', {id: this.state.downloaded_circuit.id, navigation: this.props.navigation});
    };

    componentWillMount(){
        this.checkDownloadedCircuit();
    }

    render() {
        return (

            this.props.selectedCircuit &&
                    <Card transparent="true">
                        <CardItem>
                            <Body style={{ alignItems: 'center', flex: 1, justifyContent:'space-between'}}>
                                <Text>{I18n.t('nom')} {this.props.selectedCircuit.name}</Text>
                                <Text>{I18n.t('distance')} {this.props.selectedCircuit.distance !== null ? (this.props.selectedCircuit.distance/1000).toFixed(2) : "0"} Km</Text>
                                <Text>{I18n.t('duree')} {this.props.selectedCircuit.duration !== null ? moment.duration(parseInt(this.props.selectedCircuit.duration), 'seconds').format('H[h] m[m] s[s]') : "0"}</Text>
                                <Text>{I18n.t('denivele')} {this.props.selectedCircuit.ascent !== null ? "+" + Math.round(this.props.selectedCircuit.ascent) +"m / -" +Math.round(this.props.selectedCircuit.descent): "0"} m</Text>

                                {this.state.showLoading === true && <Spinner color="blue" />}

                                {this.state.downloaded_circuit?
                                    <View style={{flexDirection: 'row'}}>
                                        <Button
                                            onPress={() => this.playGame()}>
                                            <Text>Jouer</Text>
                                        </Button>
                                        <Button style={{marginLeft: 10}}
                                            onPress={() => this.props.onTap()}>
                                            <Text>Afficher la description</Text>
                                        </Button>
                                    </View>
                                    :
                                    <View style={{flexDirection: 'row'}}>
                                        <Button
                                            onPress={() => this.downloadCircuit()}>
                                            <Text>Télécharger</Text>
                                        </Button>
                                        <Button style={{marginLeft: 10}}
                                            onPress={() => this.props.onTap()}>
                                            <Text>Afficher la description</Text>
                                        </Button>
                                    </View>

                                }
                            </Body>
                        </CardItem>
                    </Card>


        )};
        
    
        // if(this.state.circuit)
        //     return (
        //         <Card transparent="true">
        //             <CardItem>
        //                 <Body>
        //                     <List>
        //                         <ListItem>
        //                             <Text>Nom: {this.state.circuit.course.name}</Text>
        //                         </ListItem>
        //                         {this.props.isFull &&
        //                             <>
        //                                 <ListItem>
        //                                     <Text>Nombre d'étapes: {this.state.circuit.steps.length}</Text>
        //                                 </ListItem>
        //                                 <ListItem>
        //                                     <Text>Description: {this.state.circuit.course.description}</Text>
        //                                 </ListItem>
        //                             </>
        //                         }
        
        //                     </List>
        //                 </Body>
        //             </CardItem>
        //             <CardItem footer bordered>
        //             {this.state.exist ? 
        //             <Button rounded block 
        //                 onPress={this.props.selectCircuit}><Text>Jouer</Text>
        //             </Button> :
        //             <Button rounded block
        //                 onPress={() => this.downloadCircuit(this.state.circuit)}>
        //                 <Text>Télécharger le circuit</Text>
        //                 </Button>
        //             }
        //             </CardItem>
        //         </Card>
        //     )
        // else
        //     return (
        //         <></>
        //     )


};

const styles = StyleSheet.create({
    bottom: {
        backgroundColor: 'red'
    },
    dimensions: {
        position: 'absolute',
        width: '100%',
        height: '50%'
    }
});