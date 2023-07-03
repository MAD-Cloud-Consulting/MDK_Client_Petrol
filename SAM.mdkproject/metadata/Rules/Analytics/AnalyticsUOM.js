export default function AnalyticsUOM(context) {
    /**
     * PRT Measuring Point Case
     */
    let binding = context.binding;
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
       binding = binding.PRTPoint;
    }

    if (binding.MeasurementDocs.length < 1) {
        return '';
    } else {
        return binding.UoM;
    }
}
