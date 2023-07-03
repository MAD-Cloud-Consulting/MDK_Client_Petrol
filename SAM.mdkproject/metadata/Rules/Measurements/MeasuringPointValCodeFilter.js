export default function MeasuringPointValCodeFilter(context) {
    let readLink = context.binding['@odata.readLink'];
    let propertyName = 'CharName';
    if (readLink && readLink.indexOf('MyWorkOrderOperations') !== -1) {
        propertyName = 'PRTPoint/CharName';
    }
    return { name: propertyName, values: [{ReturnValue: '', DisplayValue: context.localizeText('valuation_code_only')}]};
 }
