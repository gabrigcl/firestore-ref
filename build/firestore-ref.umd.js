// firestore-ref v0.0.1 by Gabriel Castro
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.firestoreRef = {}));
}(this, function (exports) { 'use strict';

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
            (reference.collection || reference.doc) ? ref_ = reference : ref_ = null;
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

    exports.firestoreRef = firestoreRef;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
