import FetchRequest from '../../Common/Query/FetchRequest';

export default function PointDetailsOnReturning(context) {
    return rebindPageObject(context).then(() => {
        
        context.getControl('SectionedTable')._context.binding = context._context.binding;
        context.getControl('SectionedTable').redraw();
    });
}

function rebindPageObject(context) {

    let readLink = context.getBindingObject()['@odata.readLink'];
    let query = '';
    if (readLink !== 'sap_mobile.MyWorkOrderTool') {
        query = '$expand=MeasurementDocs&$select=*,MyWorkOrderTool,MeasurementDocs/ReadingDate,MeasurementDocs/ReadingTime,MeasurementDocs/ReadingValue,MeasurementDocs/IsCounterReading,MeasurementDocs/CounterReadingDifference,MeasurementDocs/MeasurementDocNum,MeasurementDocs/CodeGroup';
    }

    return new FetchRequest(readLink, query).get(context, readLink, true).then(result => {
        // Set the page binding to the updated object
        context._context.binding = result.getItem(0);
        return true;
    });
}
