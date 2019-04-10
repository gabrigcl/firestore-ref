import { concatRefPath } from './concat-refpath';

/**
 * Transforms a firestore reference path string "collection/doc/..." into a firestore reference object
 * or concatenates a prevously created reference with an inner reference writen as a path string format.
 * @param {Object} firestore firestore application object e.g: db = firebase().firestore()
 * @param {Object} reference firestore reference previously created or a path string in format "collection/doc/..."
 * @param {String} refPath a path string in format "collection/doc/..." (optional)
 * @returns a firestore reference resulted from the concatenation and transformation of reference and refPath arguments
 */
export var ref = function(firestore, reference, refPath) {
    var ref_;
    if (typeof reference === 'string') {
        ref_ = concatRefPath(firestore, null, reference);
    } else {
        if (reference && (reference.collection || reference.doc)) { // typeof FirestoreReference
            ref_ = reference;
        } else {
            console.error('Invalid FirestoreReference:', reference);
            ref_ = null;
        }
    }
    if (ref_ && typeof refPath !== 'undefined') {
        if (typeof refPath === 'string') {
            ref_ = concatRefPath(firestore, ref_, refPath);
        } else {
            ref_ = null;
            console.error('refPath expects typeof string:', refPath);
        }
    }
    return ref_;
};
