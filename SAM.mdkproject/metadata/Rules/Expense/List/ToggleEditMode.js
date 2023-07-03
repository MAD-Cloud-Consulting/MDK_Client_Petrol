import libCommon from '../../Common/Library/CommonLibrary';

export default function ToggleEditMode(context) {
    let mode = libCommon.getStateVariable(context, 'ExpenseEditMode');
    libCommon.setStateVariable(context, 'ExpenseEditMode', !mode);
    
    let page = context.evaluateTargetPathForAPI('#Page:CreatedExpenseListPage');
    if (page) {
        page.redraw();
    }
}
