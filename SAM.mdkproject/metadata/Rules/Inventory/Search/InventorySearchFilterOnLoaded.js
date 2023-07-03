import filterOnLoaded from '../../Filter/FilterOnLoaded';
import libCom from '../../Common/Library/CommonLibrary';

export default function InventorySearchFilterOnLoaded(context) {
    
    filterOnLoaded(context); //Run the default filter on loaded
    let clientData = context.evaluateTargetPath('#Page:' + libCom.getStateVariable(context, 'INVENTORY_LIST_PAGE') + '/#ClientData');
    let formCellContainer = context.getControl('FormCellContainer');
    
    let dueDateSwitchControl = formCellContainer.getControl('DueDateSwitch');
    let dueStartDateFilterControl = formCellContainer.getControl('DueStartDateFilter');
    let dueEndDateFilterControl = formCellContainer.getControl('DueEndDateFilter');
    let dateCustomPickerControl = formCellContainer.getControl('DateCustomPicker');

    if (clientData.DueDateSwitch !== undefined) {
        dueDateSwitchControl.setValue(clientData.DueDateSwitch);
    }
    if (clientData.DueStartDateFilter !== undefined) {
        dueStartDateFilterControl.setValue(clientData.DueStartDateFilter);
    }
    if (clientData.DueEndDateFilter !== undefined) {
        dueEndDateFilterControl.setValue(clientData.DueEndDateFilter);
    }
    if (clientData.DateCustomPicker !== undefined) {
        dateCustomPickerControl.setValue(clientData.DateCustomPicker);
    }
}
