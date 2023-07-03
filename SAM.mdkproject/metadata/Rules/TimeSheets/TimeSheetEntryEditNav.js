import libCom from '../Common/Library/CommonLibrary'; 
export default function TimeSheetEntryEditNav(context) {
    let binding = context.binding;
    libCom.setOnCreateUpdateFlag(context, 'UPDATE');
    if (binding['@sap.isLocal']) {
        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryEditNav.action');
    } 
}
