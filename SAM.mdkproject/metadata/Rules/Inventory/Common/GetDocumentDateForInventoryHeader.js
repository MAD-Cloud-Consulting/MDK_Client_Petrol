import common from '../../Common/Library/CommonLibrary';

/**
 * Gets the document date for each inventory header object type
 */
 
export default function GetDocumentDateForInventoryHeader(clientAPI) {
    var binding = clientAPI.getBindingObject();
    var statusValue;

    if (binding['@odata.readLink'] && binding['@odata.readLink'].includes('ProductionOrderHeaders')) {
        statusValue = binding.BasicStartDate;
    } else if (binding['@odata.readLink'] && binding['@odata.readLink'].includes('MaterialDocuments')) {
        statusValue = binding.DocumentDate;
    } else if (binding.MyInventoryObject_Nav) {
        statusValue = binding.MyInventoryObject_Nav.ObjectDate;
    }

    if (statusValue) {
        var date = common.dateStringToUTCDatetime(statusValue);
        var dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }

    return '';
}
