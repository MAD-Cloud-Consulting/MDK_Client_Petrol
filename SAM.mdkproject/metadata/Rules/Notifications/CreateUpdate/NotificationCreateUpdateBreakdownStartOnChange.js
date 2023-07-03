export default function breakdownStartOnChange(context) {

    //Toggle the editable status of the breakdown start date/time
    let toggle = false;

    if (context.getValue() === true) {
        toggle = true;
    }
    context.getPageProxy().evaluateTargetPath('#Control:MalfunctionStartDatePicker').setEditable(toggle);
    context.getPageProxy().evaluateTargetPath('#Control:MalfunctionStartTimePicker').setEditable(toggle);

}
