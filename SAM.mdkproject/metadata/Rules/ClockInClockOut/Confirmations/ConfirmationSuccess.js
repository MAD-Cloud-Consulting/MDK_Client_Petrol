import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function ConfirmationSuccess(context) {

    //Save the final confirmation flag to the state variable for OperationMobileStatusLibrary/SubOperationMobileStatusLibrary to use
    let isFinalConfirmation = libCommon.getControlProxy(context, 'IsFinalConfirmation').getValue();
    let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    libCommon.setStateVariable(context, 'IsFinalConfirmation', isFinalConfirmation, libCommon.getPageName(previousPage));
    
    //Handle removing clock in/out records after time entry
    libCommon.setStateVariable(context, 'ClockTimeSaved', true);
    return libClock.removeUserTimeEntries(context, '', false, true);
}
