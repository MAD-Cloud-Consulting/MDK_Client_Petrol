import errorVal from '../Common/Library/ErrorLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function SyncErrorTarget(context) {
    if (!libVal.evalIsEmpty(errorVal.getErrorMessage(context))) {
        return [{title: 'Error Title'}];
    }
    return [];
}
