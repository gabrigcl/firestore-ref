
import { concatRefPath } from './concat-refpath';

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
export var ref = function(firestore, reference, refPath) {
    var ref_;
    if (typeof reference === 'string') {
        ref_ = concatRefPath(firestore, null, reference);
    } else {
        ((reference) && (reference.collection || reference.doc)) ? ref_ = reference : ref_ = null;
    }
    if (refPath) {
        if (typeof refPath === 'string') {
            ref_ = concatRefPath(firestore, ref_, refPath);
        }
    }
    return ref_;
};