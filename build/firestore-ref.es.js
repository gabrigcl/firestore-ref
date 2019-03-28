// firestore-ref v0.1.2 by Gabriel Castro
var validatePath = function (path) {
     return /^[^\s\/]+(?:\/[^\s\/]+)*$/.test(path);
};

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
        console.error('Firestore reference ' + path + ' string is in invalid format!');
        ref_ = null;
    }
    return ref_;
};

/**
 * Transforms a firestore reference path string "collection/doc/..." into a firestore reference object
 * or concatenates a prevously created reference with an inner reference writen as a path string format.
 * @param {Object} firestore firestore application object e.g: db = firebase().firestore()
 * @param {Object} reference firestore reference previously created or a path string in format "collection/doc/..."
 * @param {String} refPath a path string in format "collection/doc/..." (optional)
 * @returns a firestore reference resulted from the concatenation and transformation of reference and refPath arguments
 */
var ref = function(firestore, reference, refPath) {
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

/**
 * Returns ref(reference, refPath) function using a firebase().firestore instance
 * @param {Object} firestore firebase().firestore instance
 * @returns A ref() function that concatenates a firebase reference object with 
 * a firestore reference path string (e.g: "collection/doc/subcollection/...")
 * and returns a merged firestore reference.
 */
var firestoreRef = function (firestore) {
    return (function(fs) {
        /**
         * Transforms a firestore reference path string (in format "collection/doc/...") into a firestore reference object
         * or concatenates a prevously created reference with an inner reference defined as a path string format.
         * The "reference" first argument may be a string path (in format "collection/doc/...") or a firestore reference 
         * object previously created. If "reference" is a string path, it should init with a "collection" reference and 
         * refers to a top level collection. If "reference" or "refPath" are invalid ("reference" is null, undefined, not a firestore 
         * reference object type or a string, empty string or "refPath" is not a string or empty string), 
         * the return will be null.
         * @param {Object} reference firestore reference previously created or a path string in format "collection/doc/..."
         * @param {String} refPath a path string in format "collection/doc/..." (optional)
         * @returns a firestore reference resulted from the concatenation and transformation of reference and refPath arguments
         */
        var r = function(reference, refPath) {
            return ref(fs, reference, refPath);
        };
        return r;
    })(firestore);    
};

export { firestoreRef };
