export default function breakdownEndOnChange(context) {

    //Toggle the editable status of the breakdown start date/time
    let toggle = false;

    if (context.getValue() === true) {
        toggle = true;
    }
    context.getPageProxy().evaluateTargetPath('#Control:MalfunctionEndDatePicker').setEditable(toggle);
    context.getPageProxy().evaluateTargetPath('#Control:MalfunctionEndTimePicker').setEditable(toggle);

}
