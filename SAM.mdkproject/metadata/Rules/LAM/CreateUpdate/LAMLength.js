import LAMValue from './LAMValue';

export default function LAMLength(context) {

    let value = context.evaluateTargetPath('#Control:Length/#Value');

    return LAMValue(context, value);

}
