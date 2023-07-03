import commonLib from '../../Common/Library/CommonLibrary';

export default function ExpenseListLoaded(context) {
    commonLib.setStateVariable(context, 'ExpenseListLoaded', true);
}
