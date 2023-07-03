export default function AnalyticsValueAxisTitle(context) {
    let binding = context.binding;
    ///Check if PRT
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
       binding = binding.PRTPoint;
    }
    return context.localizeText('reading_uom', [binding.UoM]);
}
