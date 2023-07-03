import libVal from '../Common/Library/ValidationLibrary';

export default function FunctionalLocationStatus(context) {
    let flocation = context.binding;
    if (!libVal.evalIsEmpty(flocation.ObjectStatus_Nav.SystemStatus_Nav) && !libVal.evalIsEmpty(flocation.ObjectStatus_Nav.SystemStatus_Nav.StatusText)) {
        return flocation.ObjectStatus_Nav.SystemStatus_Nav.StatusText;
    } else {
        return '-';
    }
}
