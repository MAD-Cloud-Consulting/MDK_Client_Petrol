
import LAMValue from './LAMValue';

export default function LAMEndMarkerDistance(context) {
    return LAMValue(context, context.evaluateTargetPath('#Control:DistanceFromEnd/#Value'));
}

