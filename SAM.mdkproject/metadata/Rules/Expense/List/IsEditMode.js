import libCommon from '../../Common/Library/CommonLibrary';

export default function IsEditMode(context) {
    return !!libCommon.getStateVariable(context, 'ExpenseEditMode');
}
