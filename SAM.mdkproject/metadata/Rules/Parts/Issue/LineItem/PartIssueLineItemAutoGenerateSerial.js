import libVal from '../../../Common/Library/ValidationLibrary';
export default function PartIssueLineItemAutoGenerate(context) {
    let autoGenerateSwitch = context.evaluateTargetPath('#Control:AutoGenerateSerialNumberSwitch/#Value');
    if (!libVal.evalIsEmpty(context.binding.SerialNoProfile) && autoGenerateSwitch ) {
        return 'X';
    } else {
        return '';
    }
}
