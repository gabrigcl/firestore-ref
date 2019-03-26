'use strict';

var chai = require('chai');
var firebase = require('firebase/app');
require('firebase/firestore');

var validatePath = function (path) {
     return /^[^\s\r\/]+(?:\/[^\s\r\/]+)*$/.test(path);
};

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
var concatRefPath = function(firestore, ref, path) {
    var ref_ = ref;
    path = path.trim();
    if (validatePath(path)) {
        var pathElms = path.split('/');
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
                    // console.error(`Invalid FirestoreReference:`, ref); obs: already verified in ref.js, never reaches here using the entire library
                    return null;
                }
            } else { // ref_ expects only null
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
    } else {
        console.error(`Firestore reference "${path}" string is in invalid format!`);
        ref_ = null;
    }
    return ref_;
};

const should = chai.should();
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
            chai.expect(validatePath('')).to.be.false;
            chai.expect(validatePath('/')).to.be.false;
            chai.expect(validatePath('/acollection')).to.be.false;
            chai.expect(validatePath('acollection/')).to.be.false;
            chai.expect(validatePath('acollection//adoc')).to.be.false;
        });
        it('should return true from valid strings', function() {
            chai.expect(validatePath('acollection')).to.be.true;
            chai.expect(validatePath('acollection/5dy2QgnUQY27JRTHY5xP')).to.be.true;
            chai.expect(validatePath('acollection/5dy2QgnUQY27JRTHY5xP/0R9vos3I3UL2djGjqVPB')).to.be.true;
        });
    });
});

describe('#concatRefPath', function() {

    context('test only referece path parser', function() {
        it('should return a correct reference object', function() {
            chai.expect(
                concatRefPath(
                    firestore, 
                    null, 
                    'toplevelcollection'
                )
            ).to.eql(firestore.collection('toplevelcollection'));
            chai.expect(
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
            chai.expect(
                concatRefPath(
                    firestore, 
                    someCollection, 
                    'innerdoc'
                )
            ).to.eql(someCollection.doc('innerdoc'));

            chai.expect(
                concatRefPath(
                    firestore, 
                    someCollection, 
                    'innerdoc/innercollection/moreinnerdoc/moreinnercollection'
                )
            ).to.eql(someCollection.doc('innerdoc').collection('innercollection').doc('moreinnerdoc').collection('moreinnercollection'));
       
            chai.expect(
                concatRefPath(
                    firestore, 
                    someDoc, 
                    'innercollection'
                )
            ).to.eql(someDoc.collection('innercollection'));
        });
    });
});

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
