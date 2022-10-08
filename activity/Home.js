import React, { Component } from 'react';
import { Header, Content, Form, Item, Input, Container, Label, Button, Text, Body} from 'native-base';
import { View, StyleSheet, Image } from 'react-native';
import I18n from '../translations/i18n';


export default class Home extends Component {

    render() {

        return (
            <Container style={{backgroundColor: "#1DF6C0"}}>
                <View style={{width: '100%', height: '10%'}}>
                    <Text>{I18n.t('whatDoYouWantToDo')}</Text>
                </View>
                
                <View style={{width: '100%', height: '12.5%', backgroundColor: 'white'}}>
                    <Body style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <Button rounded light style={{width: 200}}>
                            <Text>{I18n.t('reprendreCircuit')}</Text>
                        </Button>
                    </Body>
                </View>

                <View style={{width: '100%', height: '12.5%', backgroundColor: 'blue'}}>
                    <Body style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <Button rounded light>
                            <Text>{I18n.t('trouverCircuit')}</Text>
                        </Button>
                    </Body>
                </View>

                <View style={{width: '100%', height: '12.5%', backgroundColor: 'red'}}>
                    <Body style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <Button rounded light>
                            <Text>{I18n.t('mesCicuits')}</Text>
                        </Button>
                    </Body>
                </View>

                <View style={{width: '100%', height: '12.5%', backgroundColor: 'yellow'}}>
                    <Body style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <Button rounded light>
                            <Text>{I18n.t('monCompte')}</Text>
                        </Button>
                    </Body>
                </View>

            </Container>
        );
    }
}

const styles = StyleSheet.create({

})