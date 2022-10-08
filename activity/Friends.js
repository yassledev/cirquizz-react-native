import React, { Component } from 'react';
import { Header, Content, Form, Item, Input, Container, Label, Button, Text, Body } from 'native-base';

export default class Friends extends Component {

    login(){
        fetch('', {

        })
    }

    render() {

        return (
            <Container>
                <Content>
                    <Form>
                        <Item floatingLabel>
                        <Label>Username</Label>
                        <Input />
                        </Item>
                        <Item floatingLabel last>
                        <Label>Password</Label>
                        <Input />
                        </Item>
                    </Form>
                    <Body>
                    <Button block primary>
                            <Text>Connexion</Text>
                    </Button>
                    </Body>
                </Content>
            </Container>
        );
    }
}