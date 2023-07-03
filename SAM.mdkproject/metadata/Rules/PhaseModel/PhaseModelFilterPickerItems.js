export default function PhaseModelFilterPickerItems(context, entityType) {
    let filter = "$filter=EntityType eq '" + entityType + "' and Phase ne ''&$orderby=Phase";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], filter).then(result => {
        var json = [];
        result.forEach(function(element) {
            json.push({
                'DisplayValue': `${element.Phase} - ${element.PhaseDesc}`,
                'ReturnValue': element.Phase,
            });
        });
        const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
        let finalResult = [...uniqueSet].map(item => JSON.parse(item));
        return finalResult;
    });
}
// WO: ORI
// OP: OVG
// NOTI: QMI
