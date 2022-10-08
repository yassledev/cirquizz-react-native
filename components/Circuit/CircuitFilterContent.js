import React, { Component } from 'react';
import {
    Text,
    Icon,
    ListItem,
    Radio, Form, Item, Picker
} from 'native-base';
import {View, TextInput} from "react-native";
import Datastore from 'react-native-local-mongodb'
const db = new Datastore({ filename: 'Cirquizz' });
import I18n from "../../translations/i18n";

let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

export default class CircuitFilterContent extends Component {



    render() {
        return (
            this.props.isFilterActive && <View style={{flexDirection: 'column'}}>
                {
                    this.props.arrayFilter[0] &&
                    <View style={{backgroundColor: 'white'}}>
                        <ListItem onPress={() => this.props.handleChange([30,60], 'duration')} >
                            {
                                <Radio selected={this.props.dataFilter.duration[0] === 30 && this.props.dataFilter.duration[1] === 60 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceTimeFilter', "short"])} </Text>
                        </ListItem>

                        <ListItem onPress={() => this.props.handleChange([60,120], 'duration')} >
                            {
                                <Radio selected={this.props.dataFilter.duration[0] === 60 && this.props.dataFilter.duration[1] === 120 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceTimeFilter', "medium"])} </Text>
                        </ListItem>

                        <ListItem onPress={() => this.props.handleChange([120,240], 'duration')} >
                            {
                                <Radio selected={this.props.dataFilter.duration[0] === 120 && this.props.dataFilter.duration[1] === 240 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceTimeFilter', "long"])} </Text>
                        </ListItem>

                    </View>
                }
                {
                    this.props.arrayFilter[1] &&
                    <View style={{backgroundColor: 'white'}}>
                        <ListItem onPress={() => this.props.handleChange([0,10], 'length')} >
                            {
                                <Radio selected={this.props.dataFilter.length[0] === 0 && this.props.dataFilter.length[1] === 10 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceLengthFilter', "short"])} </Text>
                        </ListItem>

                        <ListItem onPress={() => this.props.handleChange([10,30], 'length')} >
                            {
                                <Radio selected={this.props.dataFilter.length[0] === 10 && this.props.dataFilter.length[1] === 30 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceLengthFilter', "medium"])} </Text>
                        </ListItem>

                        <ListItem onPress={() => this.props.handleChange([30,100], 'length')} >
                            {
                                <Radio selected={this.props.dataFilter.length[0] === 30 && this.props.dataFilter.length[1] === 100 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceLengthFilter', "long"])} </Text>
                        </ListItem>

                    </View>

                }

                {
                    this.props.arrayFilter[2] &&
                    <View style={{backgroundColor: 'white'}}>
                        <Text>Rayon de recherche (en kilomètres) : </Text>
                        <Form>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.props.dataFilter.position ? this.props.dataFilter.position.split(",").pop().split(",").pop() : ""}
                                    onValueChange={(v) => this.props.handleChange(`${this.props.currentLocation.latitude},${this.props.currentLocation.longitude},${v}`,'position')}

                                >
                                    <Picker.Item label="" value="" />
                                    <Picker.Item label="1" value="1" />
                                    <Picker.Item label="5" value="5" />
                                    <Picker.Item label="10" value="10" />
                                    <Picker.Item label="20" value="20" />
                                    <Picker.Item label="50" value="50" />
                                    <Picker.Item label="100" value="100" />
                                </Picker>
                            </Item>
                        </Form>

                    </View>
                }

                {
                    this.props.arrayFilter[3] &&
                    <View style={{backgroundColor: 'white'}}>
                        <ListItem onPress={() => this.props.handleChange([0,100], 'elevation')} >
                            {
                                <Radio selected={this.props.dataFilter.elevation[0] === 0 && this.props.dataFilter.elevation[1] === 100 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceDenivFilter', "short"])} </Text>
                        </ListItem>

                        <ListItem onPress={() => this.props.handleChange([100,500], 'elevation')} >
                            {
                                <Radio selected={this.props.dataFilter.elevation[0] === 100 && this.props.dataFilter.elevation[1] === 500 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceDenivFilter', "medium"])} </Text>
                        </ListItem>

                        <ListItem onPress={() => this.props.handleChange([500,5000], 'elevation')} >
                            {
                                <Radio selected={this.props.dataFilter.elevation[0] === 500 && this.props.dataFilter.elevation[1] === 5000 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceDenivFilter', "long"])} </Text>
                        </ListItem>

                    </View>
                }

                {
                    this.props.arrayFilter[4] &&
                    <View style={{backgroundColor: 'white'}}>
                        <ListItem onPress={() => this.props.handleChange([1,2], 'stars')} >
                            {
                                <Radio selected={this.props.dataFilter.stars[0] === 1 && this.props.dataFilter.stars[1] === 2 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceNotesFilter', "short"])} </Text>
                        </ListItem>

                        <ListItem onPress={() => this.props.handleChange([2,3], 'stars')} >
                            {
                                <Radio selected={this.props.dataFilter.stars[0] === 2 && this.props.dataFilter.stars[1] === 3 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceNotesFilter', "medium"])} </Text>
                        </ListItem>

                        <ListItem onPress={() => this.props.handleChange([3,5], 'stars')} >
                            {
                                <Radio selected={this.props.dataFilter.stars[0] === 3 && this.props.dataFilter.stars[1] === 5 }/>
                            }
                            <Text style={{paddingLeft: 10}}>{I18n.t(['choiceNotesFilter', "long"])} </Text>
                        </ListItem>

                    </View>
                }

                {
                    this.props.arrayFilter[5] &&
                    <View style={{backgroundColor: 'white'}}>
                        <ListItem>
                            <Text>{I18n.t('nomDuCircuit')}</Text>
                            <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, flex: 1}}
                                       onChangeText={(v) => this.props.handleChangeText(v,'name')}
                                       value={this.props.dataFilter.name}
                            />
                        </ListItem>


                    </View>
                }


            </View>



        )};
};


/*



 */

