/**
   * Get the class characteristics values based on the entity type
   * 
   * @param {formCell} context
   * 
   * @returns {string} entity set
   * 
   */
  import Logger from '../Log/Logger';
  export default function ClassCharValueEntitySet(context) {
      let entityType = context.binding['@odata.type'];
      if (entityType === '#sap_mobile.MyEquipClass') {
          return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments(\'' + context.binding.EquipId + '\')/Classes', [], '$filter=(InternClassNum eq \'' + context.binding.InternClassNum + '\')' + '&$expand=ClassDefinition/ClassCharacteristics').then(function(results) {
              if (results.getItem(0)) {
                  return results.getItem(0)['@odata.readLink']+ '/ClassDefinition/ClassCharacteristics';
              }
              return '';
          });
      } else if (entityType === '#sap_mobile.MyFuncLocClass') {
          return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations(\'' + context.binding.FuncLocIdIntern + '\')/Classes', [], '$filter=(InternClassNum eq \'' + context.binding.InternClassNum + '\')' + '&$expand=ClassDefinition/ClassCharacteristics').then(function(results) {
            if (results.getItem(0)) {
                return results.getItem(0)['@odata.readLink']+ '/ClassDefinition/ClassCharacteristics';
            }
            return '';
        });
      } else {
          Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Not a valid EntityType for Classification');
      }
  }
