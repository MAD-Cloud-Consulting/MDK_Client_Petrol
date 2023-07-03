import commonlib from '../../../Common/Library/CommonLibrary';
export default function SerialNumber(context) {
    let index = commonlib.getStateVariable(context,'SerialPartsCounter');
    let SerialNumPicker = context.evaluateTargetPath('#Control:SerialNumLstPkr/#Value');
    return SerialNumPicker[index].ReturnValue;
}
