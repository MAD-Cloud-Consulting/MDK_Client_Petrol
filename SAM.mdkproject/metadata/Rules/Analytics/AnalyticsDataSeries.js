import chartType from './ChartType';
import libCommon from '../Common/Library/CommonLibrary';
import deviceType from '../Common/DeviceType';
export default function AnalyticsDataSeries(context) {
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
   /**
    * Returns data depending on the type of chart
    */
   if (binding.MeasurementDocs.length > 0) {
      ///Sorting by  date
      binding.MeasurementDocs.sort(function(a, b) {
         return new Date(a.ReadingTimestamp) - new Date(b.ReadingTimestamp);
      });
      switch (chartType(context)) {
         case 'valCode':
               ///Valuation code plots no data points
               break;
         case 'Line':
               ///Line chart plots reading values
               for (let i = 0; i < binding.MeasurementDocs.length; i++) {
                  data.push(binding.MeasurementDocs[i].ReadingValue);
               }
               break;
         case 'Column':
               ///Column chart plots the difference
               for (let i = 0; i < binding.MeasurementDocs.length; i++) {
                  if (!libCommon.isCurrentReadLinkLocal(binding.MeasurementDocs[i]['@odata.readLink'])) {
                     data.push(binding.MeasurementDocs[i].CounterReadingDifference);
                  }
                }
                break;     
         default:
                break;
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
      return [data];
  }
