import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function ConfirmationDateFromOData(context, confirmation, isStart) {

    let date, time;
    if (isStart) {
        date = confirmation.StartDate;
        time = confirmation.StartTime;
    } else {
        date = confirmation.FinishDate;
        time = confirmation.FinishTime;
    }

    return new OffsetODataDate(context, date, time);
}
