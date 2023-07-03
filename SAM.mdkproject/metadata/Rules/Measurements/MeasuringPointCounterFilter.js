export default function MeasuringPointCounter(context) {
    let readLink = context.binding['@odata.readLink'];
    let propertyName = 'IsCounter';
    if (readLink && readLink.indexOf('MyWorkOrderOperations') !== -1) {
        propertyName ='PRTPoint/IsCounter';
    }
    return { name: propertyName, values: [{ReturnValue: 'X', DisplayValue: context.localizeText('counter')}, {ReturnValue: '', DisplayValue: context.localizeText('non_counter')}]};
 }
