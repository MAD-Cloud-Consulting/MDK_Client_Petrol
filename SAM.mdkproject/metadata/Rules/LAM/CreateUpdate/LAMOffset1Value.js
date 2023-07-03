import LAMValue from './LAMValue';

export default function LAMOffset1Value(context) {
    return LAMValue(context, context.evaluateTargetPath('#Control:offset1/#Value'));
}
