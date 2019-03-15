// firestore-ref v0.0.1 by Gabriel Castro
/**
 * Transforms an array of firestore path nodes "collection/doc/..." into a firestore reference
 * and concatenates with a firestore previously created reference object (if is passed).
 * If "ref" first argument is evaluated as false, "pathElms" second argument should init with
 * "collection". Ex: somecollection/somedoc/innercollection
 * @param {Object} ref firestore reference previously created
 * @param {Array} pathElms array of firestore path nodes
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

/**
 * Transforms a firestore reference path string "collection/doc/..." into a firestore reference object
 * or concatenates a prevously created reference with an inner reference in a path string format.
 * If "ref" first argument is evaluated as false, "path" second argument should init with
 * "collection" and refers to a top level collection. Ex: somecollection/somedoc/innercollection.
 * @param {Object} ref firestore reference previously created or a path string in format "collection/doc/..."
 * @param {String} path a path string in format "collection/doc/..."
 * @returns a firestore reference resulted from the concatenation and transformation of ref and path arguments
 */
var ref = function(firestore, ref, path) {
    var ref_;
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

export { ref };
