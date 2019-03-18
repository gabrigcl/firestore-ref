'use strict';

var chai = require('chai');
var firebase = require('firebase/app');
require('firebase/firestore');

/**
 * Transforms an array of firestore path nodes "collection/doc/..." into a firestore reference
 * and concatenates with a firestore previously created reference object (if is passed).
 * If "ref" first argument is evaluated as false, "pathElms" second argument should init with
 * "collection". Ex: somecollection/somedoc/innercollection
 * @param {Object} firestore firestore application object e.g: db = firebase().firestore()
 * @param {Object} ref firestore reference previously created
 * @param {Array} pathElms array of firestore path segments (parsed from a string in format "collection/doc/collection/...")
 * @returns a firestore reference resulted from the concatenation of ref and pathElms arguments
 */
var concatRefPath = function(firestore, ref, pathElms) {
    var ref_ = ref;
    var rest;
    if (pathElms.length > 0) {
        if (ref_) {
            if (ref_.collection) {
                rest = 0;
                ref_ = ref_.collection(pathElms[0]);
            } else if(ref_.doc) {
                rest = 1;
                ref_ = ref_.doc(pathElms[0]);
            } else {
                ref_ = null;
            }
        } else {
            rest = 0;
            ref_ = firestore.collection(pathElms[0]);
        }
        for (var i = 0; i < pathElms.length; i++) {
            if (i === 0) {
                continue;
            }
            (i%2 === rest) ? ref_ = ref_.collection(pathElms[i]) : ref_ = ref_.doc(pathElms[i]);
        }
    }
    return ref_;
};

const config = {
    apiKey: "AIzaSyAYiJoJMxAJmRXHvOWVnRAciKcI-x5sg40",
    authDomain: "firestore-ref-test.firebaseapp.com",
    databaseURL: "https://firestore-ref-test.firebaseio.com",
    projectId: "firestore-ref-test",
    storageBucket: "firestore-ref-test.appspot.com",
    messagingSenderId: "859161328509"
};


const firestore = firebase.initializeApp(config).firestore();

describe('#concatRefPath', function() {

    context('test only referece path parser', function() {
        it('should return a collection reference', function() {
            chai.expect(
                !!concatRefPath(
                    firestore, 
                    null, 
                    ['toplevelcollection']
                ).doc
            ).to.be.true;
        });

        it('should return a doc reference', function() {
            chai.expect(
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
            chai.expect(
                concatRefPath(
                    firestore, 
                    someCollection, 
                    []
                ) === someCollection
            ).to.be.true;
        });

        it('should return a doc reference if passed a collection reference and a path with a single doc', function() {
            chai.expect(
                !!concatRefPath(
                    firestore, 
                    someCollection, 
                    ['innerdoc']
                ).collection
            ).to.be.true;
        });

        it('should return a collection reference if passed a collection reference and a deeper path ended with a collection reference', function() {
            chai.expect(
                !!concatRefPath(
                    firestore, 
                    someCollection, 
                    ['innerdoc', 'innercollection']
                ).doc
            ).to.be.true;

            chai.expect(
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
            chai.expect(
                !!concatRefPath(
                    firestore, 
                    someDoc, 
                    ['innerCollection']
                ).doc
            ).to.be.true;
        });

        it('should return a doc reference if passed a doc reference and a deeper path ended with a doc reference', function() {
            chai.expect(
                !!concatRefPath(
                    firestore, 
                    someDoc, 
                    ['innerCollection', 'innerDoc']
                ).collection
            ).to.be.true;

            chai.expect(
                !!concatRefPath(
                    firestore, 
                    someDoc, 
                    ['innerCollection', 'innerDoc', 'deepCollection', 'deepDoc']
                ).collection
            ).to.be.true;

            chai.expect(
                !!concatRefPath(
                    firestore, 
                    someDoc, 
                    ['innercollection', 'innerdoc', '2innercollection', '2innerdoc', '3innercollection', '3innerdoc']
                ).collection
            ).to.be.true;
        });
    });
});

// export function testRef(t) => {
    
// }
