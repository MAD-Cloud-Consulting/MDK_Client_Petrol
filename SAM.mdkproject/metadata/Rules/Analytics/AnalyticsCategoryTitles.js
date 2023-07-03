import OffsetODataDate from '../Common/Date/OffsetODataDate';
import deviceType from '../Common/DeviceType';
export default function AnalyticsCategoryTitles(context) {
    let data = [];
    const tabletMaxNumOfPoints = 7;
    const phoneMaxNumOfPoints = 4;
    /**
     * PRT Measuring Point Case
     */
    let binding = context.binding;
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
       binding = binding.PRTPoint;
    }
    if (binding.MeasurementDocs.length > 0) {
      ///Sort base on time stamp
      binding.MeasurementDocs.sort(function(a, b) {
        return new Date(a.ReadingTimestamp) - new Date(b.ReadingTimestamp);
      });
      //Fomat the reading dates labels for the chart
      for (let i = 0; i < binding.MeasurementDocs.length; i++) {
            let dt = new OffsetODataDate(context, binding.MeasurementDocs[i].ReadingDate, binding.MeasurementDocs[i].ReadingTime);
            data.push(context.formatDate(dt.date(), '', '', {format: 'short'}));
      }
      switch (deviceType(context)) {
         ///return the last points depending on the device
        case 'Phone':
           if (binding.MeasurementDocs.length > phoneMaxNumOfPoints) {
               data = data.slice(-phoneMaxNumOfPoints);
           }
           break;
        case 'Tablet':
           if (binding.MeasurementDocs.length > tabletMaxNumOfPoints) {
              data = data.slice(-tabletMaxNumOfPoints);
           }
           break;
        default:
              break;
     }
    } 
    return  data;
 }
