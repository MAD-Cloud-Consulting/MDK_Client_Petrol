import errorVal from '../Common/Library/ErrorLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function IsSyncErrorsExists(context) {
    if (!libVal.evalIsEmpty(errorVal.getErrorMessage(context))) {
        return true;
    }
    return false;
}
