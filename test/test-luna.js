import { concatRefPath } from '../src/concat-refpath';
// import {ref} from '../src/ref';

const firebase = require('firebase/app');
require('firebase/firestore');

const config = {
    apiKey: "AIzaSyAYiJoJMxAJmRXHvOWVnRAciKcI-x5sg40",
    authDomain: "firestore-ref-test.firebaseapp.com",
    databaseURL: "https://firestore-ref-test.firebaseio.com",
    projectId: "firestore-ref-test",
    storageBucket: "firestore-ref-test.appspot.com",
    messagingSenderId: "859161328509"
};


const firestore = firebase.initializeApp(config).firestore();
// console.log(firestore);

export function testConcatRefPath(t) {
    
    t.assert(
        !!concatRefPath(
            firestore, 
            null, 
            ['toplevelcollection']
        ).doc, 
        'Path array parser: result should be a collection reference'
    );
    t.assert(
        !!concatRefPath(
            firestore, 
            null, 
            ['toplevelcollection', 'somedoc']
        ).doc, 
        'Path array parser: result should be a doc reference'
    );
    const someCollection = firestore.collection('somecollection');
    t.assert(
        concatRefPath(
            firestore, 
            someCollection, 
            []
        ) === someCollection, 
        `Passing a ref without a path array to concatenate: 
        result should result in the same ref passed`
    );
    t.assert(
        !!concatRefPath(
            firestore, 
            someCollection, 
            ['innerdoc']
        ).collection, 
        `Concatenating a collection ref to a path array with a single doc: 
        result should be a doc ref`
    );
    t.assert(
        !!concatRefPath(
            firestore, 
            someCollection, 
            ['innerdoc', 'innercollection']
        ).doc, 
        `Concatenating a collection ref to a path array ended with collection:
         result should be a collection ref`
    );
    t.assert(
        !!concatRefPath(
            firestore, 
            someCollection, 
            ['innerdoc', 'innercollection', 'moreinnerdoc', 'moreinnercollection']
        ).doc, 
        `Concatenating a collection ref to a path array ended with collection (deeper):
         result should be a collection ref`
    );
    const someDoc = firestore.collection('somecollection').doc('innerDoc');
    t.assert(
        !!concatRefPath(
            firestore, 
            someDoc, 
            ['innercollection']
        ).doc, 
        `Concatenating a doc ref to a path array with a single collection:
         result should be a collection ref`
    );
    t.assert(
        !!concatRefPath(
            firestore, 
            someDoc, 
            ['innercollection', 'innerdoc']
        ).collection, 
        `Concatenating a doc ref to a path array ended with doc:
         result should be a doc ref`
    );
    t.assert(
        !!concatRefPath(
            firestore, 
            someDoc, 
            ['innercollection', 'innerdoc', '2innercollection', '2innerdoc', '3innercollection', '3innerdoc']
        ).collection, 
        `Concatenating a doc ref to a path array ended with doc (high deep):
         result should be a doc ref`
    );
};

// export function testRef(t) => {
    
// }