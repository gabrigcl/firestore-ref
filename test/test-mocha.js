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

// describe('#firestoreRef', function() {
    // it('should return the original reference passed unchanged, if a reference path is not passed to concatenate', function() {
    //     expect(
    //         concatRefPath(
    //             firestore, 
    //             someCollection, 
    //             []
    //         )
    //     ).to.eql(someCollection);
    // });
    // context('both arguments invalid', function() {
    //     it('should return null', function() {
    //         should.equal(ref(null, ''), null);
    //         should.equal(ref(null, {}.undef), null);
    //         should.equal(ref({a: 'a', b: 'b'}, null), null);
    //         should.equal(ref({a: 'a', b: 'b'}, {}.undef), null);
    //     });
    // });
    // context('only first argument invalid', function() {
    //     it('should return null', function() {
    //         // const libResult1 = ref({a: 'a', b: 'b'}, 'collectionfoo');
    //         // const expectedResult1 = firestore.collection('collectionfoo');
    //         // expect(libResult1).to.eql(expectedResult1);
    //         const libResult2 = ref('', 'collectionfoo/docbar');
    //         const expectedResult2 = firestore.collection('collectionfoo').doc('docbar');
    //         expect(libResult2).to.eql(expectedResult2);
    //         // expect(ref(null, 'collectionfoo/docbar')).to.eql(firestore.collection('collectionfoo').doc('docbar'));
    //     });
    // });
    // context('only second argument invalid', function() {
    //     it('should return a correct firestore reference using only the first argument, if it is a valid reference string or a valid firestore reference', function() {
    //         expect(ref('collectionfoo/docbar'), {a: 'a', b: 'b'})
    //             .to.eql(firestore.collection('collectionfoo').doc('docbar'));
    //         expect(ref('collectionfoo'), null)
    //             .to.eql(firestore.collection('collectionfoo'));
    //         expect(firestore.collection('collectionfoo').doc('bar'), '')
    //             .to.eql(firestore.collection('collectionfoo').doc('bar'));
    //     });
    // });
    // context('both arguments valid or only first argument passed and valid (ideal use)', function() {
    //     it('should return a correct firestore reference', function() {
    //         expect(ref('collectionfoo/docbar', 'subcollection/subcoldoc'))
    //             .to.eql(firestore
    //                     .collection('collectionfoo')
    //                     .doc('docbar')
    //                     .collection('subcollectionfoo')
    //                     .doc('subcoldoc'));
    //         expect(ref('collectionfoo/docbar'))
    //             .to.eql(firestore
    //                     .collection('collectionfoo')
    //                     .doc('docbar'));
    //         expect(ref(firestore.collection('collectionfoo'), 'docbar/subcollection'))
    //             .to.eql(firestore
    //                     .collection('collectionfoo')
    //                     .doc('docbar')
    //                     .collection('subcollection'));
    //     });
    // });
// });
// Null, ‘’ => null
// Null, {}.undef => null
// {a: ‘a’, b: ‘b’}, null => null
// {a: ‘a’, b: ‘b’}, {}.undef => null
// {a: ‘a’, b: ‘b’}, ‘collectionfoo’ => “collectionfoo” Type
// {a: ‘a’, b: ‘b’}, ‘collectionfoo/docbar’ => “collectionfoo/docbar” Type
// Null, ‘collectionfoo/docbar’ => “collectionfoo/docbar” Type

// ‘collectionfoo/docbar’, ‘subcollection/subcoldoc’ => ‘collectionfoo/docbar/subcollection/subcoldoc’ Type
// ref(‘collectionfoo/docbar’), ‘subcollection/subcoldoc’ => ‘collectionfoo/docbar/subcollection/subcoldoc’ Type
// ref(‘collectionfoo/docbar’), {}.undef => ref(‘collectionfoo/docbar’)
// ‘collectionfoo/docbar/collection’, null => ‘collectionfoo/docbar/collection’ Type

// write security rules to allow write only for authenticated users, others can only read
// describe('#firestoreRef fetch real firestore database result', function() {

// }

// export function testRef(t) => {
    
// }