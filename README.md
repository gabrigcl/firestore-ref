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

// # collection 'carbrands'
const carBrandsRef = ref('carbrands');
// # doc 'carbrands/ford'
const chevroletRef = ref('carbrands/chevrolet');

// concatenating a firestore reference with a string path:

// # doc 'carbrands/ford'
const carBrandsRef = firestore.collection('carbrands');
const chevroletRef = ref(carBrandsRef, 'chevrolet');
// or
const carBrandsRef = ref('carbrands');
const chevroletRef = ref(carBrandsRef, 'chevrolet');

// you can create infinite deep references

// # doc 'carbrands/chevrolet/models/camaro'
const camaroRef = ref('carbrands/ford/models/camaro');

// and concatenate

// # doc 'carbrands/ford/models/camaro/editions/3.0-turbo'
const camaroModelRef = ref('carbrands/ford/models/camaro');
const camaroTurboEditionRef = ref(camaroModelRef, 'editions/3.0-turbo');

```

# License

MIT



