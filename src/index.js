import { ref } from './ref';

/**
 * Returns ref(reference, refPath) function using a firebase().firestore instance
 * @param {Object} firestore firebase().firestore instance
 * @returns A ref() function that concatenates a firebase reference object with
 * a firestore reference path string (e.g: "collection/doc/subcollection/...")
 * and returns a merged firestore reference.
 */
export var firestoreRef = function(firestore) {
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
