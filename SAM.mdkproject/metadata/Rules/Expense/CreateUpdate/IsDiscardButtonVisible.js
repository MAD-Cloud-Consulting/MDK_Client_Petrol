import libCommon from '../../Common/Library/CommonLibrary';

export default function IsDiscardButtonVisible(context) {
    return libCommon.getStateVariable(context, 'expenseDiscardEnabled');
}
