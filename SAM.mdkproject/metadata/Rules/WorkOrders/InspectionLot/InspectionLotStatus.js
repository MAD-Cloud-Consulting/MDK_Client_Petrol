
export default function InspectionLotStatus(context) {
    let allItemCharsComplete = context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/InspectionChar_Nav`, '').then(count => {
        return count;
    });
    let allCharsComplete = context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/InspectionChar_Nav`, "$filter=Valuation eq ''").then(count => {
        return count;
    });
    return Promise.all([allItemCharsComplete, allCharsComplete]).then(results => {
        if (results[0] === 0) {
            return '-';
        }
        if (results[0] === results[1]) {
            return 'Open';
        } else if (results[1] === 0) {
            return 'Complete';
        }
        return 'In-Process';
    }); 
}
