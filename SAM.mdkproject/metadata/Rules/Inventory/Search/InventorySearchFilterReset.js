import FilterReset from '../../Filter/FilterReset';
import libCom from '../../Common/Library/CommonLibrary';

export default function InventorySearchFilterReset(context) {

    let formCellContainer = context.getPageProxy().getControl('FormCellContainer') ;  
    let dueDateSwitchControl = formCellContainer.getControl('DueDateSwitch');
    
    FilterReset(context);
    dueDateSwitchControl.setValue(false);

    let clientData = context.evaluateTargetPath('#Page:' + libCom.getStateVariable(context, 'INVENTORY_LIST_PAGE') + '/#ClientData');
    clientData.DueDateSwitch = undefined;
    clientData.DueStartDateFilter = undefined;
    clientData.DueEndDateFilter = undefined;
    clientData.DateCustomPicker = undefined;
}
