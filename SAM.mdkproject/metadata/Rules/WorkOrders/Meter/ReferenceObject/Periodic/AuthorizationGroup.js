import {ValueIfExists} from '../../../../Meter/Format/Formatter';

export default function AuthorizationGroup(context) {
    try {
        return ValueIfExists(context.binding.ConnectionObject_Nav.AuthorizationGroup_Nav.AuthGroup_Text, '-');
    } catch (exc) {
        return '-';
    }
}
