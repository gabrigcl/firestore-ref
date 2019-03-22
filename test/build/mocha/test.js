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
    console.log('pathElms', pathElms);
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
        } 
        if (!ref_) {
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

/**
 * Transforms a firestore reference path string "collection/doc/..." into a firestore reference object
 * or concatenates a prevously created reference with an inner reference writen as a path string format.
 * If "reference" argument is evaluated as false, "refPath" argument should init with
 * "collection" and refers to a top level collection. Ex: somecollection/somedoc/innercollection.
 * @param {Object} firestore firestore application object e.g: db = firebase().firestore()
 * @param {Object} reference firestore reference previously created or a path string in format "collection/doc/..."
 * @param {String} refPath a path string in format "collection/doc/..."
 * @returns a firestore reference resulted from the concatenation and transformation of ref and path arguments
 */
var ref = function(firestore, reference, refPath) {
    var ref_;
    if (typeof reference === 'string') {
        ref_ = concatRefPath(firestore, null, reference.split('/'));
    } else {
        ((reference) && (reference.collection || reference.doc)) ? ref_ = reference : ref_ = null;
    }
    if (refPath) {
        if (typeof refPath === 'string') {
            ref_ = concatRefPath(firestore, ref_, refPath.split('/'));
        }
    }
    return ref_;
};

/**
 * Get a ref(reference, refPath) function using a firebase().firestore instance
 * @param {Object} firestore firebase().firestore instance
 * @returns A ref function that concatenates a firebase reference object with 
 * a firestore reference path string (e.g: "collection/doc/subcollection/...")
 * and returns a merged firestore reference.
 */
var firestoreRef = function (firestore) {
    return (function(fs) {
        /**
         * Transforms a firestore reference path string (in format "collection/doc/...") into a firestore reference object
         * or concatenates a prevously created reference with a inner reference defined as a path string format.
         * The "reference" first argument may be a string path (in format "collection/doc/...") or a firestore reference 
         * object previously created. If "reference" is a string path, it should init with a "collection" reference and 
         * refers to a top level collection. If "reference" or "refPath" are invalid ("reference" is null, undefined, not a firestore 
         * reference object type or a string, empty string or "refPath" is null, undefined, not a string, empty string), 
         * they will be just igored while mounting the reference, and if the result can not be mounted, it will return null.
         * @param {Object} reference firestore reference previously created or a path string in format "collection/doc/..."
         * @param {String} refPath a path string in format "collection/doc/..." (optional)
         * @returns a firestore reference resulted from the concatenation and transformation of ref and path arguments
         */
        var r = function(reference, refPath) {
            return ref(fs, reference, refPath);
        };
        return r;
    })(firestore);    
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

// describe('#concatRefPath', function() {

//     context('test only referece path parser', function() {
//         it('should return a correct reference object', function() {
//             expect(
//                 concatRefPath(
//                     firestore, 
//                     null, 
//                     ['toplevelcollection']
//                 )
//             ).to.eql(firestore.collection('toplevelcollection'));
//             expect(
//                 concatRefPath(
//                     firestore, 
//                     null, 
//                     ['toplevelcollection', 'somedoc']
//                 )
//             ).to.eql(firestore.collection('toplevelcollection').doc('somedoc'));
//         });
//     });
    
//     context('with a firestore reference passed as first argument, deep references', function() {
//         const someCollection = firestore.collection('somecollection');
//         const someDoc = firestore.collection('somecollection').doc('someDoc');
        
//         it('should return the original reference passed unchanged, if a reference path is not passed to concatenate', function() {
//             expect(
//                 concatRefPath(
//                     firestore, 
//                     someCollection, 
//                     []
//                 )
//             ).to.eql(someCollection);
//         });

//         it('should return a correct reference object', function() {
//             expect(
//                 concatRefPath(
//                     firestore, 
//                     someCollection, 
//                     ['innerdoc']
//                 )
//             ).to.eql(someCollection.doc('innerdoc'));

//             expect(
//                 concatRefPath(
//                     firestore, 
//                     someCollection, 
//                     ['innerdoc', 'innercollection', 'moreinnerdoc', 'moreinnercollection']
//                 )
//             ).to.eql(someCollection.doc('innerdoc').collection('innercollection').doc('moreinnerdoc').collection('moreinnercollection'));
       
//             expect(
//                 concatRefPath(
//                     firestore, 
//                     someDoc, 
//                     ['innercollection']
//                 )
//             ).to.eql(someDoc.collection('innercollection'));
//         });
//     });
// });

/* INTEGRATION TESTS */

const ref$1 = firestoreRef(firestore);

describe('#firestoreRef', function() {
    // context('both arguments invalid', function() {
    //     it('should return null', function() {
    //         should.equal(ref(null, ''), null);
    //         should.equal(ref(null, {}.undef), null);
    //         should.equal(ref({a: 'a', b: 'b'}, null), null);
    //         should.equal(ref({a: 'a', b: 'b'}, {}.undef), null);
    //     });
    // });
    context('only first argument invalid', function() {
        it('should return a firestore reference using only the second argument, if it is a valid reference string', function() {
            // const libResult1 = ref({a: 'a', b: 'b'}, 'collectionfoo');
            // const expectedResult1 = firestore.collection('collectionfoo');
            // expect(libResult1).to.eql(expectedResult1);
            const libResult2 = ref$1('', 'collectionfoo/docbar');
            const expectedResult2 = firestore.collection('collectionfoo').doc('docbar');
            chai.expect(libResult2).to.eql(expectedResult2);
            // expect(ref(null, 'collectionfoo/docbar')).to.eql(firestore.collection('collectionfoo').doc('docbar'));
        });
    });
    // context('only second argument invalid', function() {
    //     it('should return a correct firestore reference using only the first argument, if it is a valid reference string', function() {
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
});
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
