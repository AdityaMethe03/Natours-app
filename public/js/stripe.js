import axios from 'axios';
import { showAlert } from './alerts';
import { Stripe } from 'stripe';

const stripe = Stripe('pk_test_51STzTwGmyBQnS7jg83dldYrK0MuZuM9ACefuBB6oVTihyzfwPV9mZjuSApXH2iTxQleAgL3xOtpEQO8r8fNolMQL00P2yM6iwv');

export const bookTour = async tourId => {
  try {
    //1) Get a checkout session from api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    //2) create a checkout form and charge a credit card
    window.location.replace(session.data.session.url);

  } catch (error) {
    // console.log(error);
    showAlert('error', error);
  }

}