import libVal from '../../Common/Library/ValidationLibrary';

export default function LAMEndPoint(context) {

    let value = context.evaluateTargetPath('#Control:EndPoint/#Value');

    return (!libVal.evalIsEmpty(value)) ? value : '';
}
