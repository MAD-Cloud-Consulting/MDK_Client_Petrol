import {ValueIfExists} from '../../../../Meter/Format/Formatter';

export default function ConnectionObjectDescription(context) {
    return ValueIfExists(context.evaluateTargetPath('#Property:ConnectionObject_Nav/#Property:Description'), '(No Description)');
}
