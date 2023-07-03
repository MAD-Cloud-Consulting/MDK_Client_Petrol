export default function MeasuringPointValuationCode(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    let binding = pageClientAPI.binding;

    if (binding.ValuationCode && binding.MeasuringPoint.CatalogType && binding.CodeGroup) {
        return `PMCatalogCodes(Code='${binding.ValuationCode}',CodeGroup='${binding.CodeGroup}',Catalog='${binding.MeasuringPoint.CatalogType}')`;
    }

    return '';
}
