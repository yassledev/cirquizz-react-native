import React, { Component } from 'react';
import { Header, Right, Button, Icon, Title, Text, Picker } from 'native-base';
import { MenuProvider,
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger, } from 'react-native-popup-menu';
    
let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
import I18n from '../../translations/i18n';

export default class Description extends Component {
    state= {
        language: 'java'
    }

    render(){
        return(
                <Header style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#5ff8c3'}}>
                    <Title style={{color: 'black'}}>{I18n.t('score')}{this.props.score}, </Title>

                    <Title style={{color: 'black'}}>{I18n.t('temps')}{moment.duration(parseInt(this.props.time), 'seconds').format('H[h] m[m] s[s]')}</Title>

                    <Right>

                            <Menu>
                                <MenuTrigger>
                                    <Icon name='menu' />
                                </MenuTrigger>

                                <MenuOptions>
                                    <MenuOption disabled={true}>
                                        <Button warning full onPress={this.props.pause}>
                                            <Text>Pause</Text>
                                        </Button>        
                                    </MenuOption>

                                    <MenuOption disabled={true}>
                                        <Button danger full onPress={this.props.abandon}>
                                            <Text>Abandonner</Text>
                                        </Button>        
                                    </MenuOption>


                                    <MenuOption disabled={true}>
                                        <Picker
                                            note
                                            mode="dropdown"
                                            selectedValue={this.props.translation}
                                            onValueChange={(value) => this.props.changeLanguage(value)}
                                            >
                                                {this.props.languages && this.props.languages.map((lang, index) =>
                                                    <Picker.Item label={lang.name} value={index} />
                                                )}
                                            </Picker>
                                    </MenuOption>
                                </MenuOptions>

                            </Menu>
                    </Right>
                </Header>

        )
    }

};
