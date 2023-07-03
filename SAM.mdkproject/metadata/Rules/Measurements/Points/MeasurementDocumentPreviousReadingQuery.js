/**
* Returns the query for the Previous Reading Section
* @param {IClientAPI} context
*/
export default function MeasurementDocumentPreviousReadingQuery(context) {

    if (context.binding.MeasurementDocs && context.binding.MeasurementDocs.length > 0) {  
        return '$filter=sap.islocal() eq false&$expand=MeasuringPoint&$orderby=ReadingTimestamp desc&$top=1';
    } else {
        return '';
    }
}
