export default function InspectionLotListViewEntitySet(context) {
    if (context.binding && (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' || context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation')) {
        return context.binding['@odata.readLink'] + '/EAMChecklist_Nav';
    }
    return 'EAMChecklistLinks';
}
