import libVal from '../../Common/Library/ValidationLibrary';

export default function LAMStartPoint(context) {

    let value = context.evaluateTargetPath('#Control:StartPoint/#Value');

    return (!libVal.evalIsEmpty(value)) ? value.toString() : '';

}
