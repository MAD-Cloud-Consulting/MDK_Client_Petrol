/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DueDateFilterSwitchOnChange(context) {
    
    let dueDateSwitch = context.evaluateTargetPath('#Page:InventorySearchFilterPage/#Control:DueDateSwitch');
    let startDateControl = context.evaluateTargetPath('#Page:InventorySearchFilterPage/#Control:DueStartDateFilter');
    let endDateControl = context.evaluateTargetPath('#Page:InventorySearchFilterPage/#Control:DueEndDateFilter');
    let dateCustomPicker = context.evaluateTargetPath('#Page:InventorySearchFilterPage/#Control:DateCustomPicker');

    if (dueDateSwitch.getValue()) {
        dateCustomPicker.setValue(''); //Blank out and disable the custom picker if a range is chosen
        dateCustomPicker.setEditable(false);
    } else {
        dateCustomPicker.setEditable(true);
    }

    startDateControl.setVisible(dueDateSwitch.getValue());
    endDateControl.setVisible(dueDateSwitch.getValue());

    startDateControl.redraw();
    endDateControl.redraw();

}

