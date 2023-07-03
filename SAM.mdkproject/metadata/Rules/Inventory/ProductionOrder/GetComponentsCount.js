export default function GetComponentsCount(context, replaceBinding) {
    let binding = context.binding;
    if (replaceBinding) {
        binding = replaceBinding;
    }
    if (!binding) return '';
    const entitySet = binding['@odata.readLink'] + '/ProductionOrderComponent_Nav';
    return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, '').then(result => {
        if (result === 1) {
            return context.localizeText('single_component');
        }
        return context.localizeText('number_of_components', [result]);
    });
}
