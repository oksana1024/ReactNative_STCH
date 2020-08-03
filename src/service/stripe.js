import Axios from 'axios';
// import stripe from 'tipsi-stripe';

// let Stripe_PublishKey = 'pk_test_BT3DREmIiXj1UvAVaZsa80y300Zec15sQc';

// export const getStripeToken = (cardNumber, exp_month, exp_year, cvc) => {
//   stripe.setOptions({
//     publishableKey: Stripe_PublishKey
//   })
//   return new Promise(async (resolve, reject) => {
//     try{
//       let token = await stripe.createTokenWithCard({
//           number: cardNumber,
//           expMonth: parseInt(exp_month),
//           expYear: parseInt(exp_year),
//           cvc: cvc,
//         });
//         resolve(token);
//     } catch (error) {
//         reject();
//     }
//   })
// }

// var stripe = require('stripe')(Stripe_PublishKey);
// export const getStripeToken = (cardNumber, exp_month, exp_year, cvc) => {
//   return new Promise((resolve, reject) => {
//     var request = new XMLHttpRequest();

//     request.setRequestHeader('Accept', 'application/json');
//     request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     request.setRequestHeader('Authorization', `Bearer ${Stripe_PublishKey}`);
//     request.open('POST', `https://api.stripe.com/v1/tokens?card[number]=${cardNumber}&card[exp_month]=${exp_month}&card[exp_year]=${exp_year}&card[cvc]=${cvc}`);
//     request.onreadystatechange = (e) => {
//       if (request.readyState !== 4) {
//         return;
//       }

//       if (request.status === 200) {
//         console.log('success', request.responseText);
//         resolve(request.responseText);
//       } else {
//         console.log('error', e);
//         reject();
//       }
//     };

//     request.send();
//   });
// }

// export const getStripeToken = (cardNumber, exp_month, exp_year, cvc) => {
//   console.log("Exp_month ==== ", exp_month);
//   console.log("Exp_year ===", exp_year);
//   return new Promise((resolve, reject) => {
//     const url = `https://api.stripe.com/v1/tokens`;
//     console.log(url);
//     Axios.post(
//       url,
//       {
//         'card[number]': cardNumber.toString(),
//         'card[exp_month]': exp_month.toString(),
//         'card[exp_year]': exp_year.toString(),
//         'card[cvc]': cvc.toString()
//       },
//       {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Authorization': 'Bearer pk_test_BT3DREmIiXj1UvAVaZsa80y300Zec15sQc'
//         }
//       })
//       .then((value) => {
//       console.log("Stripe Response = ", value.data);
//       // resolve(value.data)
//       if(!value.data.success) {
//         reject(value.data.message);
//       } else {
//         resolve(value.data);
//       }
//     }).catch((error) => {
//       console.log("Stripe Error = ", error);
//       reject(error.toString());
//     })
//   })
// }

// export const getStripeToken = (cardNumber, exp_month, exp_year, cvc) => {
//   return new Promise((resolve, reject) => {
//     stripe.tokens.create(
//       {
//         card: {
//           number: cardNumber,
//           exp_month: exp_month,
//           exp_year: exp_year,
//           cvc: cvc,
//         },
//       },
//       function(err, token) {
//         console.log("Stripe Error = ", err);
//         console.log("Stripe token = ", token);
//       }
//     )
//   })
// }

// export const getStripeToken = (cardNumber, exp_month, exp_year, cvc) => {
//   return new Promise((resolve, reject) => {
//     const card = {
//       'card[number]': cardNumber,
//       'card[exp_month]': exp_month,
//       'card[exp_year]': exp_year,
//       'card[cvc]': cvc
//     };
//     fetch('https://api.stripe.com/v1/tokens', {
//       headers: {
//         // Use the correct MIME type for your server
//         Accept: 'application/json',
//         // Use the correct Content Type to send data to Stripe
//         'Content-Type': 'application/x-www-form-urlencoded',
//         // Use the Stripe publishable key as Bearer
//         Authorization: `Bearer ${Stripe_PublishKey}`
//       },
//       // Use a proper HTTP method
//       method: 'post',
//       // Format the credit card data to a string of key-value pairs
//       // divided by &
//       body: Object.keys(card)
//         .map(key => key + '=' + card[key])
//         .join('&')
//     }).then(response => {
//       response.blob().then((value) => {       
//         console.log("Stripe response = ", value.json());
//       })
      
//     }).catch(error => {
//       console.log("Stripe error = ", error);
//     });
//   })
// }
  