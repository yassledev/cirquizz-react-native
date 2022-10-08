import React from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import AppNavigation from './navigation';
export default class App extends React.Component {

    render() {
        return( 
            <MenuProvider>
                <AppNavigation />
            </MenuProvider>
        )
    }
}