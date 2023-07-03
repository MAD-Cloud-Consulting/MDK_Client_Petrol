

/**
 * Reads returns OffsetType description for supplied offsetType, or No Description if none exists 
 * @param {ClientAPI} context 
 * @param {String} offsetType 
 */
export default function LAMOffsetLabel(context, offsetType='') {
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', "LAMOffsetTypes('" + offsetType + "')", [], '').then(function(result) {
        if (result && result.getItem(0) !== undefined) {
            return result.getItem(0).Description;
        } else {
            return context.localizeText('no_offset_description');
        }
    });
}

