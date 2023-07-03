/**
* This rule first gets the child count for the current object, saves it and then calls navigation action to the hierarcy control page
* @param {IClientAPI} context
*/

import Logger from '../Log/Logger';

export default function EquipmentBOMPageNav(context) {
    context.binding.Online = false;
    let filterQuery = `$expand=EquiBOMs_Nav&$filter=EquipId eq '${context.binding.EquipId}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], filterQuery).then(function(result) {
        if (result && result.length > 0) {
            if (result.getItem(0).EquiBOMs_Nav.length === 0) {
                context.binding.Online = true;
                context.binding.CreateOnlineODataAction = '/SAPAssetManager/Actions/OData/CreateOnlineOData.action';
                context.binding.OpenOnlineServiceAction = '/SAPAssetManager/Actions/OData/OpenOnlineService.action';
                context.showActivityIndicator(context.localizeText('online_search_activityindicator_text'));
                let filterOnlineQuery = `$expand=BOMHeader_Nav/BOMItems_Nav&$filter=EquipId%20eq%20'${context.binding.EquipId}'`;
                return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(function() {
                    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'EquipmentBOMs', [], filterOnlineQuery).then(function(equipBOMresult) {
                        // do the logic
                        context.dismissActivityIndicator();
                        if (equipBOMresult) {
                            context.binding.HC_ROOT_CHILDCOUNT = equipBOMresult.getItem(0).BOMHeader_Nav.BOMItems_Nav.length;
                            context.getPageProxy().setActionBinding(context.binding);
                        }
                        return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/BOMHierarchyControlPageNavOnline.action');
                    }).catch(function() {
                        context.dismissActivityIndicator();
                    });
                }).catch(function(err) {
                    // Could not init online service
                    Logger.error(`Failed to initialize Online OData Service: ${err}`);
                    context.dismissActivityIndicator();
                    context.setValue(false);
                    context.setEditable(false);
                });
            } else {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'EquipmentBOMs', [], `$expand=BOMHeader_Nav/BOMItems_Nav&$filter=EquipId eq '${context.binding.EquipId}'`).then(function(results) {
                    context.binding.HC_ROOT_CHILDCOUNT = 0;
                    if (results && results.length > 0) {
                        context.binding.HC_ROOT_CHILDCOUNT = results.getItem(0).BOMHeader_Nav.BOMItems_Nav.length;
                    }
                    context.getPageProxy().setActionBinding(context.binding);
                    return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/BOMHierarchyControlPageNav.action');
                }).catch(function(err) {
                    Logger.error(`Failed to get BOMItems count : ${err}`);
                });
            }
        }
        return true;
    });
}
