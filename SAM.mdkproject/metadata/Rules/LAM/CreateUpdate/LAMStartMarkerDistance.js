import LAMValue from './LAMValue';

export default function LAMStartMarkerDistance(context) {
    return LAMValue(context, context.evaluateTargetPath('#Control:DistanceFromStart/#Value'));
}
