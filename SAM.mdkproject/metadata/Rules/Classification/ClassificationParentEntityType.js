

import Logger from '../Log/Logger';
/**
 * Send the parent entity type by evaluating the read links
 * @param {*} context 
 */
export default function ClassificationParentEntityType(context) {
    var previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    if (previousPage.getReadLink().includes('ClassCharacteristics')) {
        previousPage = context.evaluateTargetPathForAPI('#Page:ClassificationDetailsPage');
    }
    if (previousPage.getReadLink().includes('Equip')) {
        return 'Equipments';
    } else if (previousPage.getReadLink().includes('Func')) {
        return 'FunctionalLocations';
    } else {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Not a valid EntityType for Classification');
        return '';
    }
}
