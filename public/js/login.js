import '@babel/polyfill';
// import {displayMap} from './mapbox';
import axios from 'axios';
//npm i axios
import { showAlert } from './alerts';

export const login = async (email, password) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
        console.log(res);
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });

        if (res.data.status === 'success') {
            location.reload(true); //set to true to reload fresh page
            showAlert('success', 'Logged out successfully!');
        }
    } catch (error) {
        console.log(error.response);
        showAlert('error', 'Error logging out! Try again.');
    }
}