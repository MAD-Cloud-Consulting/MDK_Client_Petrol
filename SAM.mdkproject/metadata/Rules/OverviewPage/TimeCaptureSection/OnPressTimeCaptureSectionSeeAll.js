import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';


export default function OnPressTimeCaptureSectionSeeAll(context) {
    return TimeCaptureTypeHelper(context, ConfirmationsNav, TimesheetsNav);
}

function ConfirmationsNav(context) {
    return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationsOverviewListViewNav.action');
}

function TimesheetsNav(context) {
    return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntriesListViewNav.action');
}
