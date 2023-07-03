import common from '../../Common/Library/CommonLibrary';

export default function breakdownOnChange(context) {

    let toggle = false;
    var onCreate = common.IsOnCreate(context);

    if (context.getValue() === true) {
        toggle = true;
    }
    context.getPageProxy().evaluateTargetPath('#Control:MalfunctionStartDatePicker').setVisible(toggle);
    context.getPageProxy().evaluateTargetPath('#Control:MalfunctionStartTimePicker').setVisible(toggle);
    context.getPageProxy().evaluateTargetPath('#Control:BreakdownStartSwitch').setVisible(toggle);
    if (!onCreate) {
        context.getPageProxy().evaluateTargetPath('#Control:BreakdownEndSwitch').setVisible(toggle);
        context.getPageProxy().evaluateTargetPath('#Control:MalfunctionEndDatePicker').setVisible(toggle);
        context.getPageProxy().evaluateTargetPath('#Control:MalfunctionEndTimePicker').setVisible(toggle);
    }
}
