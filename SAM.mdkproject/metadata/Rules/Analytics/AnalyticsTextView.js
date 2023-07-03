import chartType from './ChartType';
import libForm from '../Common/Library/FormatLibrary';
export default function AnalyticsTextView(context) {

    let binding = context.binding;
   if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
       binding = binding.PRTPoint;
   }
    /**
     * If there is no readings in MeasurementDocs return no data message.
     */
    if (binding.MeasurementDocs.length < 1) {
        return context.localizeText('no_data_message');
    } else {
            /**
             * This is just sorting by ReadingTimestamp
             */
            binding.MeasurementDocs.sort(function(a, b) {
                return new Date(b.ReadingTimestamp) - new Date(a.ReadingTimestamp);
            });

        /**
         * Display only the most recent reading depending on chart type
         */
        switch (chartType(context)) {
            case 'valCode':
                return libForm.getFormattedKeyDescriptionPair(context, binding.MeasurementDocs[0].ValuationCode, binding.MeasurementDocs[0].CodeShortText);
            case 'Line':
                return binding.MeasurementDocs[0].ReadingValue;
            case 'Column':
                 return binding.MeasurementDocs[0].CounterReadingDifference;
            default:
                return '-';
        }
    }
 }
