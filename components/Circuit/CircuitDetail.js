import React, { Component } from 'react';
import { Text, Tabs, Tab, Button, Container, Content, Icon } from 'native-base';
import {StyleSheet, View, ScrollView, BackHandler, Dimensions} from "react-native";
import { BASE_URL, MOBILE_URL, HEADER } from '../../constants/Request';
import Datastore from 'react-native-local-mongodb'
import WebViewDescr from "./Description";
const db = new Datastore({ filename: 'Cirquizz' });
import HTML from 'react-native-render-html';
import I18n from "../../translations/i18n";
import StarRating from 'react-native-star-rating';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts'
import { NavigationActions } from "react-navigation";
import {upperFirst} from 'lodash'

let listener = null;
let backButtonPressFunction = () => false;
let navigate = null;

let width= Dimensions.get('window').width;

export default class Description extends Component {

    state = {
        circuit : null,
        exist: false,
        id: null,
        description: null,
        stats: null,
        comments: null,
        areCommentsEnabled: false,
        translations: null,
        areStatsEnabled: false
    };



    getDetails = async () => {
        let id = this.props.navigation.getParam('id');

        console.log(MOBILE_URL + '/courses/' + id);


        fetch(MOBILE_URL + '/courses/' + id,{
            method: 'GET',
            headers: HEADER
        })
            .then((response) => response.json())
            .then((res) => {

                console.log(res);

                const description = res.description ? res.description : I18n.t('noDescr');
                const stats = res.stats ? res.stats: I18n.t('noStats');
                const comments = res.comments ? res.comments : I18n.t('noComment');
                const translations = res.translations;

                this.setState({ circuit :res, description: description, stats: stats, comments: comments, translations: translations});

            })
            .catch((err) => {
                console.log(err)
            })

    };


    componentWillMount(){
        //const { goBack } = this.props.navigation;
        this.getDetails();
        navigate = this.props.navigation.getParam('navigation');

    }


    returnComments = () =>
    {
        return this.state.comments.length > 0 ?
            <View>
                <Button style={{marginTop: 10}} onPress={() => this.setState({areCommentsEnabled: !this.state.areCommentsEnabled})}>
                    <Text>{I18n.t('commentaire')}</Text>
                    {!this.state.areCommentsEnabled ? <Icon name="ios-arrow-down" icon="ios-arrow-down"/> : <Icon name="ios-arrow-up" icon="ios-arrow-up"/> }
                </Button>
                {
                    this.state.areCommentsEnabled && this.state.comments.map((content) =>
                    {
                        return <Content style={{marginTop: 20}}>
                            <View>
                                <Text>{I18n.t('commentairesDe')} {content.user.username}</Text>

                            </View>
                            <View><StarRating
                                disabled={true}
                                maxStars={5}
                                rating={content.stars}
                                fullStarColor={'orange'}
                            /></View>
                            <View style={{marginLeft: 30}}>
                                <Text>{I18n.t('detail')}{content.comment}</Text>
                            </View>
                            </Content>


                    })
                }
            </View> : <></>
    };


    returnStats = () =>{
        let dataScore = [];
        let dataTime = [];
        const contentInset = { top: 20, bottom: 20 };
        if(this.state.stats.length > 0)
        {
            this.state.stats.map((content) => {
                dataScore.push(content.score);
                dataTime.push(content.time);
            })
        }
        return dataScore.length > 0 ?
            <View>
                <Button style={{marginTop: 10}} onPress={() => this.setState({areStatsEnabled: !this.state.areStatsEnabled})}>
                    <Text>Statistiques : </Text>
                    {!this.state.areStatsEnabled ? <Icon name="ios-arrow-down" icon="ios-arrow-down"/> : <Icon name="ios-arrow-up" icon="ios-arrow-up"/> }
                </Button>
                {
                    this.state.areStatsEnabled &&
                    <>
                        <Text>{I18n.t('nbrPointUserCourse')}</Text>
                        <View style={{ height: 200, flexDirection: 'row' }}>
                            <YAxis
                                data={ dataScore }
                                contentInset={ contentInset }
                                svg={{
                                    fill: 'grey',
                                    fontSize: 10,
                                }}
                                numberOfTicks={ 10 }
                                formatLabel={ value => `${value} points` }
                            />
                            <LineChart
                                style={{ flex: 1, marginLeft: 16 }}
                                data={ dataScore }
                                svg={{ stroke: 'rgb(134, 65, 244)' }}
                                contentInset={ contentInset }
                            >
                                <Grid/>
                            </LineChart>
                        </View>
                        <Text>{I18n.t('tpsRealuserCourse')}</Text>
                        <View style={{ height: 200, flexDirection: 'row' }}>
                            <YAxis
                                data={ dataTime }
                                contentInset={ contentInset }
                                svg={{
                                    fill: 'grey',
                                    fontSize: 10,
                                }}
                                numberOfTicks={ 10 }
                                formatLabel={ value => `${value} minutes` }
                            />
                            <LineChart
                                style={{ flex: 1, marginLeft: 16 }}
                                data={ dataTime }
                                svg={{ stroke: 'rgb(134, 65, 244)' }}
                                contentInset={ contentInset }
                            >
                                <Grid/>
                            </LineChart>
                        </View>

                    </>


                }

            </View>

            : <></>
    };

    componentDidMount() {

        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    }

    handleBackButton(){
        //console.log(navigate);
        //const {goBack} = navigate.actions.goBack;
        navigate.navigate('Circuit');
        //navigate.pop(1);
        return true;
    }



    render() {
        return (

            <>
                <Container>
                    {
                        this.state.circuit ?
                            <Tabs>
                                {
                                    this.state.circuit.course.locales && this.state.circuit.course.locales.map((content, index) =>
                                    {
                                        return <Tab heading={upperFirst(content.name)}>
                                            <ScrollView style={{ flex: 1 }}>
                                            <>
                                                <View style={{justifyContent: 'center',
                                                    alignItems: 'center'}}>
                                                    <Text>{this.state.circuit.course.name}</Text>
                                                </View>
                                                <View style={{marginTop: 20}}>
                                                    {this.state.circuit.course.translations.length > 0 ?
                                                        <>
                                                            <Text>Description du circuit : </Text>
                                                            <HTML html={this.state.circuit.course.translations[index].description} imagesMaxWidth={100} />
                                                        </>

                                                    : <Text>Description du circuit non traduite dans cette langue</Text>}
                                                </View>
                                                <View style={{marginTop: 20}}>
                                                    {this.state.translations.length > 0 ?
                                                        <>
                                                            <Text>Description de la version {this.state.translations[index].version_id} du circuit: </Text>
                                                            <HTML html={this.state.translations[index].change_log} imagesMaxWidth={100} />
                                                        </>

                                                        : <Text>Description de la version non traduite dans cette langue</Text>}
                                                </View>
                                                {
                                                    this.returnComments()
                                                }

                                                {
                                                    this.returnStats()
                                                }
                                            </>
                                            </ScrollView>
                                        </Tab>
                                    })
                                }
                            </Tabs> :
                            <View>
                                <Text>Il n'y a pas de description complète</Text>
                            </View>

                    }

                </Container>
            </>

            //  this.state.circuit &&
            // <ScrollView style={{ flex: 1 }}>
            //     <HTML html={item.content} imagesMaxWidth={100} />
            // </ScrollView>


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
/*
<Text>
                    {
                        //this.state.circuit.course.name ? "salut" : "nope"
                    }
                    </Text>
                    <Text>
                    {
                       // <ScrollView style={{ flex: 1 }}>
                         // <HTML html={this.state.description} imagesMaxWidth={100} />
                        //</ScrollView>
                    }
                    </Text>
                    {
                        this.state.comments[0].id &&
                        <Text>
                            {
                                this.state.comments[0].id
                            }
                        </Text>
                    }

                    {
                        this.state.stats[0].id &&
                        <Text>
                            {
                                this.state.stats[0].id
                            }
                        </Text>
                    }







 */