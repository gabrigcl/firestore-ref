/*eslint-disable*/
import { expect, should as shd } from 'chai';

import { validatePath } from '../src/validate-path';
import { concatRefPath } from '../src/concat-refpath';
import { firestoreRef } from '../src/index';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

const should = shd();
const config = {
    apiKey: "AIzaSyAYiJoJMxAJmRXHvOWVnRAciKcI-x5sg40",
    authDomain: "firestore-ref-test.firebaseapp.com",
    databaseURL: "https://firestore-ref-test.firebaseio.com",
    projectId: "firestore-ref-test",
    storageBucket: "firestore-ref-test.appspot.com",
    messagingSenderId: "859161328509"
};


const firestore = firebase.initializeApp(config).firestore();

/* UNIT TESTS */

describe('#validatePath', function() {
    context('test regex against Firestore collection and documents name conventions', function() {
        it('should return false from invalid strings', function() {
            expect(validatePath('')).to.be.false;
            expect(validatePath('/')).to.be.false;
            expect(validatePath('/acollection')).to.be.false;
            expect(validatePath('acollection/')).to.be.false;
            expect(validatePath('acollection//adoc')).to.be.false;
        });
        it('should return true from valid strings', function() {
            expect(validatePath('acollection')).to.be.true;
            expect(validatePath('acollection/5dy2QgnUQY27JRTHY5xP')).to.be.true;
            expect(validatePath('acollection/5dy2QgnUQY27JRTHY5xP/0R9vos3I3UL2djGjqVPB')).to.be.true;
        });
    });
});

describe('#concatRefPath', function() {

    context('test only referece path parser', function() {
        it('should return a correct reference object', function() {
            expect(
                concatRefPath(
                    firestore, 
                    null, 
                    'toplevelcollection'
                )
            ).to.eql(firestore.collection('toplevelcollection'));
            expect(
                concatRefPath(
                    firestore, 
                    null, 
                    'toplevelcollection/somedoc/subcollection'
                )
            ).to.eql(firestore.collection('toplevelcollection').doc('somedoc').collection('subcollection'));
        });
    });
    
    context('with a firestore reference passed as first argument and deeper references', function() {
        const someCollection = firestore.collection('somecollection');
        const someDoc = firestore.collection('somecollection').doc('someDoc');

        it('should return a correct reference object', function() {
            expect(
                concatRefPath(
                    firestore, 
                    someCollection, 
                    'innerdoc'
                )
            ).to.eql(someCollection.doc('innerdoc'));

            expect(
                concatRefPath(
                    firestore, 
                    someCollection, 
                    'innerdoc/innercollection/moreinnerdoc/moreinnercollection'
                )
            ).to.eql(someCollection.doc('innerdoc').collection('innercollection').doc('moreinnerdoc').collection('moreinnercollection'));
       
            expect(
                concatRefPath(
                    firestore, 
                    someDoc, 
                    'innercollection'
                )
            ).to.eql(someDoc.collection('innercollection'));
        });
    });
});

/* INTEGRATION TESTS */

const ref = firestoreRef(firestore);

describe('#firestoreRef', function() {
    context('invalid arguments', function() {
        it('should return null', function() {
            should.equal(ref(null, 'carbrands/ford'), null);
            should.equal(ref({}.undef, 'carbrands'), null);
            should.equal(ref({a: 'a', b: 'b'}, 'carbrands/ford/models'), null);
            should.equal(ref(firestore.collection('carbrands'), null), null);
            should.equal(ref(firestore.collection('carbrands'), {a: 'a', b: 'b'}), null);
            should.equal(ref(firestore.collection('carbrands'), ''), null);
            should.equal(ref(firestore.collection('carbrands'), '/'), null);
            should.equal(ref(firestore.collection('carbrands'), '/ford'), null);
            should.equal(ref(firestore.collection('carbrands'), 'ford/'), null);
            should.equal(ref(firestore.collection('carbrands'), 'ford//models'), null);
        });
    });
    context('valid arguments', function() {
        it('should return the same firestore reference if only a firestore reference is passed', function() {
            expect(ref(firestore.collection('carbrands').doc('ford')))
                .to.be.eql(firestore.collection('carbrands').doc('ford'));
        });
        it('should return the expected firestore reference', function() {
            expect(ref('carbrands/ford'))
                .to.be.eql(firestore.collection('carbrands').doc('ford'));
            expect(ref('carbrands/ford', 'models/camaro'))
                .to.be.eql(firestore.collection('carbrands').doc('ford').collection('models').doc('camaro'));
            expect(ref(firestore.collection('carbrands'), 'ford'))
                .to.be.eql(firestore.collection('carbrands').doc('ford'));
        });
    });
});