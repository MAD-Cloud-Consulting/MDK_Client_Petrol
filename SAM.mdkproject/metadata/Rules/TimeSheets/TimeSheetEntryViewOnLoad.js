export default function TimeSheetEntryEditNav(context) {
    let binding = context.binding;
    if (!binding['@sap.isLocal']) {
        context.setActionBarItemVisible(0, false);
    } 
}
