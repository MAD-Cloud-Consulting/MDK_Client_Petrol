export default function MeasuringPointValuationCodeQueryOptions(context) {
 
    let binding = context.binding;
    //This gets called from MeasuringPoint context (Create), and also from MeasurementDocument context (Update)

    if (!binding.hasOwnProperty('CatalogType')) {
        binding = binding.MeasuringPoint;
    }
    const catalogType = binding.CatalogType;
    const codeGroup = binding.CodeGroup;
    return "$filter=CodeGroup eq '" + codeGroup + "' and Catalog eq '" + catalogType + "'&$orderby=Code";
}
