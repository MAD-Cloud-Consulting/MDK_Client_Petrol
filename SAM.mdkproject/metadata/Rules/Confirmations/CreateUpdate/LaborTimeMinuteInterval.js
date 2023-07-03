import minutesFunction from '../../TimeSheets/Entry/CreateUpdate/TimeSheetEntryMinuteInterval';
import ConfirmationDurationFromTime from '../ConfirmationDurationFromTime';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';

export default function LaborTimeMinuteInterval(context, orderId, operationNo, subOperationNo) {

    let binding = context.getBindingObject();

    if (binding.IsOnCreate) {
        let interval = minutesFunction(context);
        let elapsed = (binding._End - binding._Start) / 60000;

        // Negative check: sometimes end time will be wrong
        if (elapsed < 0) {
            binding._End = new Date();
            elapsed = (binding._End - binding._Start) / 60000;
        }
        
        return libClock.getElapsedClockTime(context, orderId, operationNo, subOperationNo).then((clockTime) => {
            if (clockTime > 0) {
                elapsed = clockTime; //Clock In/Out records were found for this business object
            }

            // small number to determine if enough time has passed to set control
            let epsilon = 1 / 7200;
            // Time interval to be used in Duration picker.
            // Set duration to time rounded to closest interval in minutes expressed in Hours
            if (elapsed > epsilon) {
                let duration = (interval) * (Math.round(elapsed/interval));
                if (duration > interval) {
                    return Promise.resolve(duration);
                }
            }
            return Promise.resolve(interval);
        });
        
    } else {
        return Promise.resolve(ConfirmationDurationFromTime(binding));
    }
}
