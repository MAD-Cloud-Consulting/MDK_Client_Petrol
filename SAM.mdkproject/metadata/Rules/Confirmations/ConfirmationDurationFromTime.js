import ODataDate from '../Common/Date/ODataDate';

export default function ConfirmationDurationFromTime(confirmation) {

    if (confirmation.ActualDuration && confirmation.ActualDuration > 0 ) { //As per Syam, the order of precedence should be AcutalDuration -> AcutalWork -> Start/End time
        return calculateDuration(confirmation.ActualDuration, confirmation.ActualDurationUOM);

    } else if (confirmation.ActualWork && confirmation.ActualWork > 0 ) {
        return calculateDuration(confirmation.ActualWork, confirmation.ActualWorkUOM);

    } else if (confirmation.StartTime && confirmation.StartDate && confirmation.FinishTime && confirmation.FinishDate) {

        let start = new ODataDate(confirmation.StartDate, confirmation.StartTime);
        let finish = new ODataDate(confirmation.FinishDate, confirmation.FinishTime);

        return (finish.date() - start.date()) / (60 * 1000); 
    } else {
        return 0.0;
    }

    function calculateDuration(duration, uom) {
        switch (uom) { //As per Syam, we should only expect the UOM to be in Minutes or Hours, but we need to account for other units in case a customer uses them
            case 'YR':
                return duration * 60 * 24 * 365; //duration is returned in minutes from the backend so proper conversion is needed to display in HH:MM
            case 'MON':
                return duration * 60 * 24 * 30;
            case 'WK':
                return duration * 60 * 24 * 7; 
            case 'D':
            case 'DAY':
                return duration * 60 * 24;
            case 'HR':
            case 'H':
                return duration * 60;
            case 'MIN':
                return duration;
            default:
                return 0.0;  
        }
    }
}
