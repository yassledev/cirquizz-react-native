import React, { Component } from 'react';
import {StyleSheet, View, TextInput, KeyboardAvoidingView, ScrollView, Modal} from "react-native";
import {Radio, ListItem, Icon, Text, Button, Picker, Form, Item, Content} from 'native-base';
import I18n from '../../translations/i18n';
import {debounce} from 'lodash'


export default class Filter extends Component {

    state = {

        dataFilter: {
            duration: [null, null],
            elevation: [null, null],
            length: [null, null],
            stars:[null, null],
            name: null,
            position: null
        },

        filterTime: false,
        filterLength: false,
        filterLocation: false,
        filterDeniv: false,
        filterNote: false,
        filterNom: false,

        arrayFilter: [false, false, false, false, false, false],

    };


    containsNullValues(currentValue) {
        return currentValue === null;
    }

    //&& value.split(",").pop().split(",").pop() !== ''

    filterCourses = () => {
        let i = 0;
        const filters = Object.keys(this.state.dataFilter).reduce((acc, filter) => {
            const value = this.state.dataFilter[filter];
            if(value && value !== '' && value[0] !== null && value[1] !== null ) {
                if(i === 0) {
                    i++;

                    if(filter==="name" || filter==="position")
                    {
                        return `${acc}?${filter}=${value}`
                    }
                    else
                    {
                        return `${acc}?${filter}Min=${value[0]}&${filter}Max=${value[1]}`;
                    }

                } else {
                    i++;
                    if(filter==="name" || filter==="position")
                    {
                        return `${acc}&${filter}=${value}`
                    }
                    else
                    {
                        return `${acc}&${filter}Min=${value[0]}&${filter}Max=${value[1]}`;
                    }
                }
            }
            return acc;
        },'');

        const url = `https://cirquizz.cedricchavaudra.pro/api/mobile/courses${filters}`;

        console.log("url filter : "+url);

        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
        .then((courses) => {
            //console.log(courses);
            return this.props.update(courses);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    handleChange = (content, name) => {

        console.log("content"+ content);
        console.log("content"+ name);
        this.setState((prevState) => {
             return {
                 dataFilter: {
                     ...prevState.dataFilter,
                     [name]: content
                 }
             };
        }, () => this.filterCourses());
    };

    handleChangeMultipleSelect = (content, name, contentForFilter) => {
        console.log('laaa');
        this.setState((prevState) => {
            return {
                dataFilter: {
                    ...prevState.dataFilter,
                    [name]: content
                }
            };
        }, () => this.setState({contentForFilter}, () => this.filterCourses()));
    };

    debouncedFilterCourses = debounce(this.filterCourses, 1000);


    handleChangeDuration = (content) =>
    {
        this.setState({duration: content}, () => this.filterCourses())
    };

    handleChangeLength = (content) =>
    {
        this.setState({length: content},() => this.filterCourses())
    };

    handleChangeDeniv = (content) =>
    {
        this.setState({elevation: content},() => this.filterCourses())
    };

    handleChangeNote = (content) =>
    {
        this.setState({stars: content},() => this.filterCourses())
    };

    handleChangePosition = (content) =>
    {
        this.setState({position: content},() => this.filterCourses())
    };


    handleChangeText = (content, name) => {
        console.log(content,name);

        if(content === '')
        {
            console.log("null content"+content);
            this.setState((prevState) => {
                return {
                    dataFilter: {
                        ...prevState.dataFilter,
                        [name]: null
                    }
                };
            }, this.debouncedFilterCourses);
        }
        else
        {
            this.setState((prevState) => {
                return {
                    dataFilter: {
                        ...prevState.dataFilter,
                        [name]: content
                    }
                };
            }, this.debouncedFilterCourses);
        }

    };

    handlerFilter = (index) =>
    {
        let tmpArray = this.state.arrayFilter;

        tmpArray[index] = !this.state.arrayFilter[index];

        for(let i = 0; i< tmpArray.length; i++)
        {
            if(i !== index)
            {
                tmpArray[i] = false;
            }
        }

        this.setState({arrayFilter: tmpArray})
    };

    handlerTrash = (id, name) =>
    {
        if(id === null)
        {
            this.setState({
                dataFilter:{
                    duration: [null, null],
                    elevation: [null, null],
                    length: [null, null],
                    stars:[null, null],
                    name: null,
                    position: null
                }
            }, () => {this.filterCourses()})

        }
    };

    render() {

        return (


            <KeyboardAvoidingView>


                <ScrollView>
                    <View style={{flexDirection: 'row', flex: 1.2, justifyContent:'space-between'}}>

                       <Button style={{ justifyContent: 'center', backgroundColor: 'white', margin: 10, flex: 0.2}} onPress={() => this.setState({filterTime: !this.state.filterTime}, () => this.handlerFilter(0))}>
                           {!this.state.arrayFilter[0] ?<Icon style={{color: '#8D8D8D'}} name="timer" icon="timer"/>: <Icon style={{color: '#013a81'}} name="timer" icon="timer"/>}
                       </Button>


                        <Button style={{justifyContent: 'center', backgroundColor: 'white',margin: 10, flex: 0.2 }} onPress={() => this.setState({filterLength: !this.state.filterLength}, () => this.handlerFilter(1)) }>
                            {!this.state.arrayFilter[1] ?<Icon style={{color: '#8D8D8D'}} name="walk" icon={"walk"}/> : <Icon style={{color: '#013a81'}}name="walk" icon={"walk"}/>}
                        </Button>


                        <Button style={{justifyContent: 'center', backgroundColor: 'white',margin: 10,flex: 0.2 }} onPress={() => this.setState({filterLocation: !this.state.filterLocation}, () => this.handlerFilter(2))}>
                            {!this.state.arrayFilter[2] ?<Icon style={{color: '#8D8D8D'}} name="ios-locate" icon="ios-locate"/> : <Icon style={{color: '#013a81'}} name="ios-locate" icon="ios-locate"/> }
                        </Button>


                        <Button style={{justifyContent: 'center', backgroundColor: 'white',margin: 10, flex: 0.2 }} onPress={() => this.setState({filterDeniv: !this.state.filterDeniv}, () => this.handlerFilter(3))}>
                            {!this.state.arrayFilter[3] ?<Icon style={{color: '#8D8D8D'}} name="ios-trending-up" icon="ios-trending-up"/> : <Icon style={{color: '#013a81'}} name="ios-trending-up" icon="ios-trending-up"/>}
                        </Button>

                        <Button style={{justifyContent: 'center', backgroundColor: 'white',margin: 10, flex: 0.2 }} onPress={() => this.setState({filterNote: !this.state.filterNote}, () => this.handlerFilter(4))}>
                            {!this.state.arrayFilter[3] ?<Icon style={{color: '#8D8D8D'}} name="ios-star" icon="ios-star"/> : <Icon style={{color: '#013a81'}} name="ios-star" icon="ios-star"/>}
                        </Button>



                        <Button style={{justifyContent: 'center', backgroundColor: 'white',margin: 10, flex: 0.2  }} onPress={() => this.setState({filterNom: !this.state.filterNom}, () => this.handlerFilter(5))}>
                            {!this.state.arrayFilter[4] ?<Icon style={{color: '#8D8D8D'}}  name="ios-search" icon="ios-search"/> : <Icon style={{color: '#013a81'}} name="ios-search" icon="ios-search"/>}
                        </Button>

                    </View>

                    <View style={{flexDirection: 'column', flex: 1}}>
                        {
                            this.state.arrayFilter[0] &&
                            <View>
                                    <ListItem onPress={() => this.handleChange([30,60], 'duration')} >
                                        {
                                            <Radio selected={this.state.dataFilter.duration[0] === 30 && this.state.dataFilter.duration[1] === 60 }/>
                                        }
                                        <Text style={{paddingLeft: 10}}>{I18n.t(['choiceTimeFilter', "short"])} </Text>
                                    </ListItem>

                                    <ListItem onPress={() => this.handleChange([60,120], 'duration')} >
                                        {
                                            <Radio selected={this.state.dataFilter.duration[0] === 60 && this.state.dataFilter.duration[1] === 120 }/>
                                        }
                                        <Text style={{paddingLeft: 10}}>{I18n.t(['choiceTimeFilter', "medium"])} </Text>
                                    </ListItem>

                                    <ListItem onPress={() => this.handleChange([120,240], 'duration')} >
                                        {
                                            <Radio selected={this.state.dataFilter.duration[0] === 120 && this.state.dataFilter.duration[1] === 240 }/>
                                        }
                                        <Text style={{paddingLeft: 10}}>{I18n.t(['choiceTimeFilter', "long"])} </Text>
                                    </ListItem>

                            </View>
                        }
                        {
                            this.state.arrayFilter[1] &&
                            <View>
                                <ListItem onPress={() => this.handleChange([0,10], 'length')} >
                                    {
                                        <Radio selected={this.state.dataFilter.length[0] === 0 && this.state.dataFilter.length[1] === 10 }/>
                                    }
                                    <Text style={{paddingLeft: 10}}>{I18n.t(['choiceLengthFilter', "short"])} </Text>
                                </ListItem>

                                <ListItem onPress={() => this.handleChange([10,30], 'length')} >
                                    {
                                        <Radio selected={this.state.dataFilter.length[0] === 10 && this.state.dataFilter.length[1] === 30 }/>
                                    }
                                    <Text style={{paddingLeft: 10}}>{I18n.t(['choiceLengthFilter', "medium"])} </Text>
                                </ListItem>

                                <ListItem onPress={() => this.handleChange([30,100], 'length')} >
                                    {
                                        <Radio selected={this.state.dataFilter.length[0] === 30 && this.state.dataFilter.length[1] === 100 }/>
                                    }
                                    <Text style={{paddingLeft: 10}}>{I18n.t(['choiceLengthFilter', "long"])} </Text>
                                </ListItem>

                            </View>

                        }

                        {
                            this.state.arrayFilter[2] &&
                            <View>
                                <Text>Rayon de recherche (en kilomètres) : </Text>
                                <Form>
                                    <Item picker>
                                        <Picker
                                            mode="dropdown"
                                            iosIcon={<Icon name="arrow-down" />}
                                            placeholderIconColor="#007aff"
                                            selectedValue={this.state.dataFilter.position ? this.state.dataFilter.position.split(",").pop().split(",").pop() : ""}
                                            onValueChange={(v) => this.handleChange(`${this.props.location.latitude},${this.props.location.longitude},${v}`,'position')}

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
                            this.state.arrayFilter[3] &&
                            <View>
                                <ListItem onPress={() => this.handleChange([0,100], 'elevation')} >
                                    {
                                        <Radio selected={this.state.dataFilter.elevation[0] === 0 && this.state.dataFilter.elevation[1] === 100 }/>
                                    }
                                    <Text style={{paddingLeft: 10}}>{I18n.t(['choiceDenivFilter', "short"])} </Text>
                                </ListItem>

                                <ListItem onPress={() => this.handleChange([100,500], 'elevation')} >
                                    {
                                        <Radio selected={this.state.dataFilter.elevation[0] === 100 && this.state.dataFilter.elevation[1] === 500 }/>
                                    }
                                    <Text style={{paddingLeft: 10}}>{I18n.t(['choiceDenivFilter', "medium"])} </Text>
                                </ListItem>

                                <ListItem onPress={() => this.handleChange([500,5000], 'elevation')} >
                                    {
                                        <Radio selected={this.state.dataFilter.elevation[0] === 500 && this.state.dataFilter.elevation[1] === 5000 }/>
                                    }
                                    <Text style={{paddingLeft: 10}}>{I18n.t(['choiceDenivFilter', "long"])} </Text>
                                </ListItem>

                            </View>
                        }

                        {
                            this.state.arrayFilter[4] &&
                            <View>
                                <ListItem onPress={() => this.handleChange([1,2], 'stars')} >
                                    {
                                        <Radio selected={this.state.dataFilter.stars[0] === 1 && this.state.dataFilter.stars[1] === 2 }/>
                                    }
                                    <Text style={{paddingLeft: 10}}>{I18n.t(['choiceNotesFilter', "short"])} </Text>
                                </ListItem>

                                <ListItem onPress={() => this.handleChange([2,3], 'stars')} >
                                    {
                                        <Radio selected={this.state.dataFilter.stars[0] === 2 && this.state.dataFilter.stars[1] === 3 }/>
                                    }
                                    <Text style={{paddingLeft: 10}}>{I18n.t(['choiceNotesFilter', "medium"])} </Text>
                                </ListItem>

                                <ListItem onPress={() => this.handleChange([3,5], 'stars')} >
                                    {
                                        <Radio selected={this.state.dataFilter.stars[0] === 3 && this.state.dataFilter.stars[1] === 5 }/>
                                    }
                                    <Text style={{paddingLeft: 10}}>{I18n.t(['choiceNotesFilter', "long"])} </Text>
                                </ListItem>

                            </View>
                        }

                        {
                            this.state.arrayFilter[5] &&
                            <View>
                                <ListItem>
                                    <Text>{I18n.t('nomDuCircuit')}</Text>
                                    <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, flex: 1}}
                                               onChangeText={(v) => this.handleChangeText(v,'name')}
                                               value={this.state.dataFilter.name}
                                    />
                                </ListItem>


                            </View>
                        }


                    </View>
                    <View style={{justifyContent: 'center'}}>
                    {
                        <View style={{marginTop: 20, justifyContent: 'center'}}>
                            <Button onPress={() => this.handlerTrash(null)}>
                                <Text>
                                    {I18n.t('reset')}
                                </Text>
                            </Button>
                        </View>



                    }
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        position: 'absolute'
    }
});

/*
Object.keys(this.state.dataFilter).some((val) => {
                                console.log(this.state.dataFilter[val]);
                                return this.state.dataFilter[val] !== null || this.state.dataFilter[val] !== '';
                            }) && <View style={{marginTop: 20}} >
                                <Button onPress={() => this.handlerTrash(null)}>
                                    <Text>
                                        {I18n.t('reset')}
                                    </Text>
                                </Button>
                            </View>
 */

/*
                                <Text>{I18n.t('filtreDuree')}</Text>
                                <Text>{I18n.t('filtreLongueur')}</Text>
                                <Text>{I18n.t('filtrePosition')}</Text>
                                <Text>{I18n.t('filtreDenivele')}</Text>
                                <Text>{I18n.t('filtreNom')}</Text>



                                 {
                                this.state.dataFilter.duration !== null ?  <Button style={{marginLeft: 10}} onPress={() => this.handlerTrash(0, 'duration')}>
                                    <Icon name="trash" icon="trash"/>
                                </Button> : <></>
                            }


                                {
                                this.state.dataFilter.lengthMax !== null || this.state.dataFilter.lengthMin !== null ?  <Button style={{marginLeft: 10}} onPress={() => {
                                    this.handlerTrash(1, 'lengthMin');
                                    this.handlerTrash(1, 'lengthMax');
                                }}>
                                    <Icon style={{marginLeft: 10}} name="trash" icon="trash"/>
                                </Button> : <></>
                            }



                                {
                                this.state.dataFilter.position !== null ?  <Button style={{marginLeft: 10}} onPress={() => this.handlerTrash(2, 'position')}>
                                    <Icon style={{marginLeft: 10}} name="trash" icon="trash"/>
                                </Button> : <></>
                            }


                             {
                                this.state.dataFilter.elevation !== null ?  <Button style={{marginLeft: 10}} onPress={() => this.handlerTrash(3, 'elevation')}>
                                    <Icon style={{marginLeft: 10}} name="trash" icon="trash"/>
                                </Button> : <></>
                            }


                            {
                                this.state.dataFilter.name !== null ?  <Button style={{marginLeft: 10}} onPress={() => this.handlerTrash(4, 'name')}>
                                    <Icon style={{marginLeft: 10}} name="trash" icon="trash"/>
                                </Button> : <></>
                            }


 */