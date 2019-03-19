import { expect } from 'chai';
import { concatRefPath } from '../src/concat-refpath';
import { firestoreRef } from '../src';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

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

describe('#concatRefPath', function() {

    context('test only referece path parser', function() {
        it('should return a collection reference', function() {
            expect(
                !!concatRefPath(
                    firestore, 
                    null, 
                    ['toplevelcollection']
                ).doc
            ).to.be.true;
        });

        it('should return a doc reference', function() {
            expect(
                !!concatRefPath(
                    firestore, 
                    null, 
                    ['toplevelcollection', 'somedoc']
                ).collection
            ).to.be.true;
        });
    });
    
    context('with a collection reference passed as first argument, deep references', function() {
        const someCollection = firestore.collection('somecollection');
        it('should return the original reference passed unchanged, if a reference path is not passed to concatenate', function() {
            expect(
                concatRefPath(
                    firestore, 
                    someCollection, 
                    []
                ) === someCollection
            ).to.be.true;
        });

        it('should return a doc reference if passed a collection reference and a path with a single doc', function() {
            expect(
                !!concatRefPath(
                    firestore, 
                    someCollection, 
                    ['innerdoc']
                ).collection
            ).to.be.true;
        });

        it('should return a collection reference if passed a collection reference and a deeper path ended with a collection reference', function() {
            expect(
                !!concatRefPath(
                    firestore, 
                    someCollection, 
                    ['innerdoc', 'innercollection']
                ).doc
            ).to.be.true;

            expect(
                !!concatRefPath(
                    firestore, 
                    someCollection, 
                    ['innerdoc', 'innercollection', 'moreinnerdoc', 'moreinnercollection']
                ).doc
            ).to.be.true;
        });
    });

    context('with a doc reference passed as first argument, deep references', function() {
        const someDoc = firestore.collection('somecollection').doc('someDoc');

        it('should return a collection reference if passed a doc reference and a path with a single collection', function() {
            expect(
                !!concatRefPath(
                    firestore, 
                    someDoc, 
                    ['innerCollection']
                ).doc
            ).to.be.true;
        });

        it('should return a doc reference if passed a doc reference and a deeper path ended with a doc reference', function() {
            expect(
                !!concatRefPath(
                    firestore, 
                    someDoc, 
                    ['innerCollection', 'innerDoc']
                ).collection
            ).to.be.true;

            expect(
                !!concatRefPath(
                    firestore, 
                    someDoc, 
                    ['innerCollection', 'innerDoc', 'deepCollection', 'deepDoc']
                ).collection
            ).to.be.true;

            expect(
                !!concatRefPath(
                    firestore, 
                    someDoc, 
                    ['innercollection', 'innerdoc', '2innercollection', '2innerdoc', '3innercollection', '3innerdoc']
                ).collection
            ).to.be.true;
        });
    });
});

/* INTEGRATION TESTS */

const ref = firestoreRef(firestore);

describe('#firestoreRef', function() {
    context('both arguments invalid', function() {
        it('should return null', function() {
            should.equal(ref(null, ''), null);
            should.equal(ref(null, {}.undef), null);
            should.equal(ref({a: 'a', b: 'b'}, null), null);
            should.equal(ref({a: 'a', b: 'b'}, {}.undef), null);
        });
    });
    context('only first argument invalid', function() {
        it('should return a valid firestore reference if second argument is a valid reference string', function() {
            const libResult1 = ref({a: 'a', b: 'b'}, 'collectionfoo');
            const expectedResult1 = firestore.collection('collectionfoo');
            expect(libResult1).to.eql(expectedResult1);
            const libResult2 = ref({a: 'a', b: 'b'}, 'collectionfoo/docbar');
            const expectedResult2 = firestore.collection('collectionfoo/docbar');
            expect(libResult2).to.eql(expectedResult2);
            expect(ref(null, 'collectionfoo/docbar').collection).to.be.true;
        });
    });
    //continue here
    context('only second argument invalid', function() {
        it('should return a valid firestore reference if second argument is a valid reference string', function() {
            expect(ref({a: 'a', b: 'b'}, 'collectionfoo').doc).to.be.true;
            expect(ref({a: 'a', b: 'b'}, 'collectionfoo/docbar').collection).to.be.true;
            expect(ref(null, 'collectionfoo/docbar').collection).to.be.true;
        });
    });
    context('both arguments valid', function() {
        it('should return a valid firestore reference if second argument is a valid reference string', function() {
            expect(ref({a: 'a', b: 'b'}, 'collectionfoo').doc).to.be.true;
            expect(ref({a: 'a', b: 'b'}, 'collectionfoo/docbar').collection).to.be.true;
            expect(ref(null, 'collectionfoo/docbar').collection).to.be.true;
        });
    });
}
// Null, ‘’ => null
// Null, {}.undef => null
// {a: ‘a’, b: ‘b’}, null => null
// {a: ‘a’, b: ‘b’}, {}.undef => null
// {a: ‘a’, b: ‘b’}, ‘collectionfoo’ => “collectionfoo” Type
// {a: ‘a’, b: ‘b’}, ‘collectionfoo/docbar’ => “collectionfoo/docbar” Type
// Null, ‘collectionfoo/docbar’ => “collectionfoo/docbar” Type
// ‘collectionfoo/docbar’, ‘subcollection/subcoldoc’ => ‘collectionfoo/docbar/subcollection/subcoldoc’ Type
// ref(‘collectionfoo/docbar’), ‘subcollection/subcoldoc’ => ‘collectionfoo/docbar/subcollection/subcoldoc’ Type
// ref(‘collectionfoo/docbar’), ‘’ => ref(‘collectionfoo/docbar’)
// ref(‘collectionfoo/docbar’), {}.undef => ref(‘collectionfoo/docbar’)
// ref(‘collectionfoo/docbar’), {a: ‘a’, b: ‘b’} => ref(‘collectionfoo/docbar’)
// ‘collectionfoo/docbar’, {}.undef => “collectionfoo/docbar” Type
// ‘collectionfoo/docbar/collection’, null => ‘collectionfoo/docbar/collection’ Type

// write security rules to allow write only for authenticated users, others can only read
describe('#firestoreRef fetch real firestore database result', function() {

}

// export function testRef(t) => {
    
// }