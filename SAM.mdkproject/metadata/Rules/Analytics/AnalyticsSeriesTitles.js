import libForm from '../Common/Library/FormatLibrary';
import chartType from './ChartType';

export default function AnalyticsSeriesTitles(context) {
  let binding = context.binding;
   if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
       binding = binding.PRTPoint;
   }
    /**
     * Return Point Number as the chart legend if 
     */
  let legend = '';
  if (chartType(context) === 'valCode') {
    return legend;
  } 
  if (binding.MeasurementDocs.length > 0) {
      return [libForm.formatDetailHeaderDisplayValue(context, binding.Point,
        context.localizeText('point'))];
  } else {
    return legend;
  }
}
