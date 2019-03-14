
import {concatRefPath} from './concatRefPath';

const ref = function(ref, path = null) {
    let ref_;
    if (typeof ref === 'string') {
        ref_ = concatRefPath(null, ref.split('/'));
    } else {
        ref_ = ref;
    }
    if (path) {
        if (typeof path === 'string') {
            ref_ = concatRefPath(ref_, path.split('/'));
        }
    }
    return ref_;
};

export {ref};