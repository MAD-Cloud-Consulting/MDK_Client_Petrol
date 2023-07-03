
import LAMValue from './LAMValue';

export default function LAMOffset2Value(context) {
    return LAMValue(context, context.evaluateTargetPath('#Control:offset2/#Value'));
}
