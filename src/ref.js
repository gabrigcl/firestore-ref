
import {concatRefPath} from './concat-refpath';

/**
 * Transforms a firestore reference path string "collection/doc/..." into a firestore reference object
 * or concatenates a prevously created reference with an inner reference in a path string format.
 * If "ref" first argument is evaluated as false, "path" second argument should init with
 * "collection" and refers to a top level collection. Ex: somecollection/somedoc/innercollection.
 * @param {Object} ref firestore reference previously created or a path string in format "collection/doc/..."
 * @param {String} path a path string in format "collection/doc/..."
 * @returns a firestore reference resulted from the concatenation and transformation of ref and path arguments
 */
const ref = function(firestore, ref, path = null) {
    let ref_;
    if (typeof ref === 'string') {
        ref_ = concatRefPath(firestore, null, ref.split('/'));
    } else {
        ref_ = ref;
    }
    if (path) {
        if (typeof path === 'string') {
            ref_ = concatRefPath(firestore, ref_, path.split('/'));
        }
    }
    return ref_;
};

export {ref};