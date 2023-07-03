/**
* Returns the query options for the Current Reading section
* @param {IClientAPI} context
*/
export default function MeasurementDocumentCurrentReadingQuery(context) {

    if (context.binding.MeasurementDocs.length > 0) {
        return '$filter=sap.islocal()&$orderby=ReadingTimestamp desc&$top=1';
    } else {
        return '';
    }

}
