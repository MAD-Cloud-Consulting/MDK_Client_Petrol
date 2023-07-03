/**
   * Get count for the of the classes belong to particular entity set
   * 
   * @param {simplePropertyCell} context
   * 
   * @returns {number} get the count of classes
   * 
   */

export default function ClassificationCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service',context.getPageProxy().binding['@odata.readLink'] + '/Classes', '');
}
