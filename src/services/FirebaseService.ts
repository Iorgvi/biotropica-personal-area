import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBcU3zPlHaByN0GETt1V26bF1isNrTdCzc',
  authDomain: 'test-pet-project-19244.firebaseapp.com',
  projectId: 'test-pet-project-19244',
  storageBucket: 'test-pet-project-19244.appspot.com',
  messagingSenderId: '524003796812',
  appId: '1:524003796812:web:c7cf232be7f13268f5d1e9',
};

const firebaseApp = initializeApp(firebaseConfig);

const messaging = getMessaging(firebaseApp);

getToken(messaging, { vapidKey: process.env.FB_VAPID_KEY })
  .then(currentToken => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log(
        'No registration token available. Request permission to generate one.',
      );
      // ...
    }
  })
  .catch(err => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });

onMessage(messaging, payload => {
  console.log('Message received. ', payload);
  // ...
});
