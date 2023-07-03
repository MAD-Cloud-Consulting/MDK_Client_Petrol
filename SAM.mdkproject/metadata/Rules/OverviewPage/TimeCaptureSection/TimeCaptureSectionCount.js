import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetsCount from '../../TimeSheets/TimeSheetsCount';
import ConfirmationsCount from '../../Confirmations/ConfirmationsCount';

export default function TimeCaptureSectionCount(context) {

    return TimeCaptureTypeHelper(context, ConfirmationsCount, TimeSheetsCount);
}
