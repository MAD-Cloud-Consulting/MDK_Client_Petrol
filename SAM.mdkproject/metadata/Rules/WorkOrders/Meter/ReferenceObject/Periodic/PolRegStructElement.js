import {ValueIfExists} from '../../../../Meter/Format/Formatter';

export default function AuthorizationGroup(context) {
    try {
        return ValueIfExists(context.binding.ConnectionObject_Nav.PolRegStructElement_Nav.PolRegStructElemText, '-');
    } catch (exc) {
        return '-';
    }
}
