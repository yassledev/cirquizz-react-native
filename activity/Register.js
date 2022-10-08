import React, { Component } from 'react';
import { Header, Content, Form, Item, Input, Container, Label, Button, Text, Body, Card, CardItem, Badge } from 'native-base';
import { MOBILE_URL, HEADER } from '../constants/Request';
import { TextInput, ImageBackground, View, Image } from 'react-native';
import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
import I18n from "../translations/i18n";


const styles = {
    alignItems:'center',
    justifyContent:'center',
    textAlign: 'center',
    alignSelf:'center',
    marginTop: 10
};

export default class Register extends Component {
    static navigationOptions = {
        title: 'Register'
    };

    state = {
        username: '',
        email: '',
        password: '',
    };

    register = () => {
        const credentials = JSON.stringify({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        });

        fetch(MOBILE_URL + '/register', {
            method: 'POST',
            headers: HEADER,
            body: credentials
        })
        .then((res) => {
            if(res.status> 400){
                throw res;
            } else {
                return res.json();
            }
        })
        .then((res) => {
            this.props.navigation.navigate('Login');
        })
        .catch((err) => {
            this.setState({ error: "Erreur  d'inscription" });
        })
    };

    render() {

        return (
            <Container>
                <ImageBackground source={require("../assets/mask-top.png")} style={{flex: 1, width: '100%', height: DEVICE_HEIGHT/3}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require("../assets/dark_copy.png")} style={{zIndex: 9999}}/>
                    </View>
                </ImageBackground>

                <Card transparent>
                    <CardItem header style={{justifyContent: 'center'}}>
                        <Text style={{fontSize: 24, fontWeight: 'bold'}}>{I18n.t('register')}</Text>
                    </CardItem>
                    <CardItem style={{justifyContent: 'center'}}>
                        <Form >
                        {this.state.error && <Badge full danger style={{alignSelf:'center'}}><Text >{this.state.error}</Text></Badge>}
                            <Item style={{width: DEVICE_WIDTH}}>
                                <Label>{I18n.t('username')}</Label>
                                <TextInput
                                    style={{width: DEVICE_WIDTH/2}}
                                    editable={true}
                                    textContentType='username'
                                    onChangeText={(text) => this.setState({ username: text })}
                                    value={this.state.username}
                                />
                            </Item>
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
                                style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                    textAlign: 'center',
                                    alignSelf:'center',
                                    marginTop: 10,
                                    width: DEVICE_WIDTH - 100}} 
                                onPress={() => this.register()} >
                                <Text>{I18n.t('register')}</Text>
                            </Button>
                        </Form>
                    </CardItem>
                </Card>
                <Image source={require("../assets/mask-bottom.png")} style={{flex: 1, height: '90%'}}/>
            </Container>
        );
    }
}