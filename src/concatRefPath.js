export const concatRefPath = function(ref, pathElms) {
    let ref_ = ref;
    let rest;
    if (pathElms.length > 0) {
        if (ref_) {
            if (ref_.collection) {
                rest = 0;
                ref_ = ref_.collection(pathElms[0]);
            } else {
                rest = 1;
                ref_ = ref_.doc(pathElms[0]);
            }
        } else {
            rest = 0;
            ref_ = this.firestore.collection(pathElms[0]);
        }
        for (let i = 0; i < pathpathElms.length; i++) {
            if (i === 0) {
                continue;
            }
            (i%2 === rest) ? ref_ = ref_.collection(pathElms[i]) : ref_ = ref_.doc(pathElms[i]);
        }
    }
    return ref_;
};

export {concatRefPath};