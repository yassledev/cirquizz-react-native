import { AsyncStorage } from "react-native";
import { MOBILE_URL, HEADER } from "../constants/Request";
//import { Updates } from 'expo';

// react-native's version of local storage
export const KEY = "token";
export const onSignIn = () => {
    AsyncStorage.setItem(KEY, "true");
};
// set storage to hold key as TRUE
export const setStorage = (data) => AsyncStorage.setItem('data', JSON.stringify(data));
// set storage to hold user data
export const onSignOut = () => {
    AsyncStorage.removeItem(KEY);
    //Updates.reload();
    // TODO
    //Updates.reloadFromCache();
};
//if user signs out, remove TRUE key
//exports.isLogged = async () => {
export const isLogged = async () => {
    try{
        const token = await AsyncStorage.getItem(KEY);
        HEADER['Authorization'] = 'Bearer ' + token;
        const res = await fetch(MOBILE_URL + '/whoami', {
            headers: HEADER
        });
        if(res.status >= 200 && res.status < 300) {
            let user = await res.json();
            await AsyncStorage.setItem('user', JSON.stringify(user));
        }
        return res.status >= 200 && res.status < 300 ? true :  false
    } catch(error){}
};