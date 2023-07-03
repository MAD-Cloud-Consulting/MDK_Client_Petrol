import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';

export default function TimeCaptureSectionTile(context) {

    return TimeCaptureTypeHelper(context, ConfirmationsTitle, TimeSheetsTitle);
}

function ConfirmationsTitle(context) {
    return context.localizeText('labor_time');
}

function TimeSheetsTitle(context) {
    return context.localizeText('time_sheets');
}
