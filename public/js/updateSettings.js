import axios from 'axios';
import { showAlert } from './alerts';

//type is either 'password' or 'data(i.e name and email)'
export const updateSettings = async (data, type) => {

    // console.log(name, email);
    try {
        const url = type === 'password'
            ? '/api/v1/users/updateMyPassword'
            : '/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url: url,
            data: data
        });
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }
        // console.log(res);
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
}