# FirestoreRef

Creates a Firebase Cloud Firestore doc or collection reference using a "URL like" path string format.

## Installation and use

```bash
npm install --save firestore-ref
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

const ref = firestoreRef(firestore);
```

3. <strong>Create collection or doc references</strong>

```javascript

// 1. Using a string path:

// # collection firestore.collection('carbrands')
const carBrandsRef = ref('carbrands');
// # doc firestore.collection('carbrands').doc('chevrolet')
const chevroletRef = ref('carbrands/chevrolet');

// 2. Concatenating a prevously created firestore reference with a string path:

// # doc firestore.collection('carbrands').doc('chevrolet')
const carBrandsRef = firestore.collection('carbrands');
const chevroletRef = ref(carBrandsRef, 'chevrolet');
// the same example using firestoreRef to create a firestore reference and concatenating
const carBrandsRef = ref('carbrands');
const chevroletRef = ref(carBrandsRef, 'chevrolet');

// 3. You can create deep references until the level Firebase permits

// # doc firestore.collection('carbrands').doc('chevrolet').collection('models').doc('camaro')
const camaroRef = ref('carbrands/chevrolet/models/camaro');
// # doc firestore.collection('carbrands').doc('chevrolet').collection('models').doc('camaro').collection('editions').doc('3.0-turbo')
const camaroRef = ref('carbrands/chevrolet/models/camaro/editions/3.0-turbo');
// the above example using firestoreRef to create a firestore reference and concatenating
const camaroModelRef = ref('carbrands/chevrolet/models/camaro');
const camaroTurboEditionRef = ref(camaroModelRef, 'editions/3.0-turbo');

```

# License

MIT



