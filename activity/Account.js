import React, { Component } from 'react';

import { onSignOut } from '../services/index';

import {Content, Container, Button, Text, Card, CardItem} from 'native-base';
import {ScrollView, StyleSheet} from 'react-native';
import {HEADER, MOBILE_URL} from '../constants/Request';
import I18n from '../translations/i18n';
import {AsyncStorage, View} from 'react-native'
import {CircuitDescriptionFavori} from "../components/Circuit/Description/CircuitDescriptionFavori";


export default class Account extends Component {
    static navigationOptions = {
        title: 'Mon Compte'
    };

    state = {
        favorites: null,
        error: null
    }

    logout = () => {
        onSignOut();
        this.props.navigation.navigate('NotAuth');
    };


    componentDidMount() {
        this.getFavorites()
    }

    getFavorites = async () => {
        HEADER['Authorization'] = 'Bearer ' + await AsyncStorage.getItem('token');
        fetch(MOBILE_URL + '/favorites', {
            headers: HEADER
        })
        .then((data) => data.json())
        .then((res) =>
        {
            this.setState({favorites: res})
        })
        .catch((err) => {
            this.setState({ error: err})
        });
    };

    onTapInfoCircuit = (content) => {
        this.props.navigation.navigate('Description', {id : content.id, latitude: 0.0, longitude: 0.0, title: content.version.course.name})
    };

    render() {

        return (
            <View>
                {this.state.favorites ? <ScrollView>
                    <Button onPress={() => this.logout()} block primary>
                        <Text>{I18n.t('deco')}</Text>
                    </Button>
                    <>
                        <Text style={styles.title}>Circuits favoris : </Text>
                        <Card>
                        {
                            this.state.favorites.map((favori, index) =>{
                                return <CircuitDescriptionFavori circuit={favori} onPress={() => this.onTapInfoCircuit(favori)}/>
                            })
                        }
                        </Card>
                    </>

                </ScrollView> : <Text>{I18n.t('dontHaveFavCircuit')}</Text>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: 30,
        height: 30
    },
    specs: {
        alignItems: "center",
        marginLeft: 10,
        flexDirection: "row"
    },
    specsText: {
        fontSize: 13,
        backgroundColor: "rgba(0,0,0,0)"
    },
    title: {
        fontWeight: "500",
        paddingLeft: 5,
        fontSize: 22,
        color: "#0A2463",
        marginBottom: 6,
        marginTop: 15
    },
    specsIcons: {
        fontSize: 20,
        color: "#0A2463"
    },
    specsWrapper: {
        // flex: 3,
        flexDirection: "row",
        justifyContent: "space-between",
        // backgroundColor: "red"
    },
    specsBloc: {
        flex: 1,
        flexDirection: "row",
        alignItems:"center",
        // backgroundColor: "yellow"
    }
});


/*
this.state.favorites.map((favori, index) =>{
                                return <CircuitDescriptionFavori circuit={favori}/>
                            })
 */