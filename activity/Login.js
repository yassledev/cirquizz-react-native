import React, { Component } from 'react';

import {ToastAndroid, ImageBackground} from 'react-native'
import { Container,  Header, Form, Content, Item, Label, Button, Text, Body,View, Badge, CardItem, Card  } from 'native-base';
import { MOBILE_URL, HEADER } from '../constants/Request';
//import { Updates } from 'expo';
import DefaultPreference from 'react-native-default-preference';
import Dimensions from 'Dimensions';
import { AsyncStorage, StyleSheet, TextInput, Image } from 'react-native';
import I18n from "../translations/i18n";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
      },
    image: {
        width: 250,
        height: 150,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        marginTop: 20,
    },
    button: {
        alignItems:'center',
        justifyContent:'center',
        textAlign: 'center',
        alignSelf:'center',
        marginTop: 10,
        width: DEVICE_WIDTH - 100,
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        width: DEVICE_WIDTH - 40,
        height: 40,
        marginHorizontal: 20,
        paddingLeft: 45,
        borderRadius: 20,
        color: '#ffffff'
    }
});


export default class Login extends Component {
    static navigationOptions = {
        title: 'Login'
    };

    state = {
        email: '',
        password: ''
    };

    login = () => {

        const credentials = JSON.stringify({
            email: this.state.email,
            password: this.state.password
        });
        
         fetch(MOBILE_URL + '/token', {
             method: 'POST',
             headers: HEADER,
             body: credentials
         })
         .then((res) => {
            if(res.status === 200){
                return res.json();
            } 
            else if(res.status === 401){
                this.setState({error: "Identifiants invalides"})
            }
            else {
                throw res;
            }
         })
         .then( async (data) =>  {
            await AsyncStorage.setItem('token', data.token);
            DefaultPreference.set('token', data.token).then(function() {console.log('done')});
            this.props.navigation.navigate('AppLoading');
        })
         .catch((err) => {
            //this.setState({ error: "err.error", email: '', password: ''});
         })
    };

    render() {

        return (
            <Container style={{justifyContent: 'center'}}>
                 <ImageBackground source={require("../assets/mask-top.png")} style={{flex: 1, width: '100%'}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require("../assets/dark_copy.png")} style={{zIndex: 9999}}/>
                    </View>
                </ImageBackground>

                <Card transparent>
                    <CardItem header style={{justifyContent: 'center'}}>
                        <Text style={{fontSize: 24, fontWeight: 'bold'}}>{I18n.t('connect')}</Text>
                    </CardItem>
                    <CardItem style={{justifyContent: 'center'}}>
                        <Form >
                        {this.state.error && <Badge full danger style={{alignSelf:'center'}}><Text >{this.state.error}</Text></Badge>}
                            <Item>
                                <Label>{I18n.t('addMail')}</Label>
                                <TextInput
                                    style={{width: DEVICE_WIDTH/2}}
                                    editable={true}
                                    onChangeText={(text) => this.setState({email: text})}
                                    value={this.state.email}
                                />
                            </Item>
                            <Item>
                                <Label>{I18n.t('password')}</Label>
                                <TextInput
                                    style={{width: DEVICE_WIDTH/2}}
                                    textContentType='password'
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(text) => this.setState({password: text})}
                                    value={this.state.password}
                                />
                            </Item>
                            <Button 
                                rounded 

                                style={styles.button} 
                                onPress={() => this.login()} >
                                <Text>{I18n.t('connect')}</Text>
                            </Button>
                        </Form>
                    </CardItem>
                </Card>

          
                <ImageBackground source={require("../assets/mask-bottom.png")} style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
                    {/* <Button transparent dark>
                        <Text style={{justifyContent: 'center', alignSelf: 'center'}}>Pas encore inscris ? Inscrivez-vous</Text>
                    </Button> */}
                </ImageBackground>
          </Container>
        );
    }
}
