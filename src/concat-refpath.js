import { validatePath } from './validate-path';

/**
 * Transforms a firestore path string "collection/doc/..." into a firestore reference
 * and concatenates with a previously created firestore reference object (if is passed).
 * If "ref" first argument is evaluated as false, "path" second argument should init with
 * "collection". Ex: somecollection/somedoc/innercollection, otherwise the firestore lib will return error.
 * @param {Object} firestore firestore application object e.g: db = firebase().firestore()
 * @param {Object} ref firestore reference previously created
 * @param {string} path firestore path segments (parsed from a string in format "collection/doc/collection/...")
 * @returns a firestore reference resulted from the concatenation of ref and path arguments
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

export { concatRefPath };