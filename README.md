# FirestoreRef

Creates a Firebase Cloud Firestore doc or collection reference using a "URL like" path string format.

## Installation and use

```bash
npm install firestore-ref
```

1. <strong>Import the lib</strong>

```javascript
// ES6 modules
import { firestoreRef } from 'firestore-ref';

// cjs modules
const firestoreRef = require('firestore-ref');
```

2. <strong>Import Firebase and Firestore libs, connect your app, and instatiate the reference creator using your firestore reference</strong>

```javascript
// example for ES6 modules
import * as firebase from 'firebase/app';
import 'firebase/firestore';

// replace with the data from your app
const config = {
    apiKey: "AIasdfYiJoJMxasdfaKcI-asdf40",
    authDomain: "theproject.firebaseapp.com",
    databaseURL: "https://theproject.firebaseio.com",
    projectId: "theproject",
    storageBucket: "theproject.appspot.com",
    messagingSenderId: "00000000"
};

const firestore = firebase.initializeApp(config).firestore();

const ref = firestoreRef(firebase);
```

3. <strong>Create collection or doc references</strong>

```javascript

// using a string path:

// # collection 'cars'
const carsRef = ref('cars');
// # doc 'cars/camaro'
const carsRef = ref('cars/camaro');

// concatenating a firestore reference with a string path:

// # doc 'cars/camaro'
const carsRef = firestore.collection('cars');
const camaroDocRef = ref(carsRef, 'camaro');
// or
const carsRef = ref('cars');
const camaroDocRef = ref(carsRef, 'camaro');

// you can create infinite deep references

// # doc 'cars/camaro/items/wheel'
const carsRef = ref('cars/camaro/items/wheel');

// and concatenate

// # doc 'cars/camaro/items/wheel/features/feature1'
const carsRef = ref('cars/camaro/items/wheel');
const wheelFeature1 = ref(carsRef, 'features/feature1');

```

# License

MIT



