import Logger from '../Log/Logger';

export default function FunctionalLocationBOMPageNav(context) {
    context.binding.Online = false;
    let filterQuery = `$expand=FLocBOMs_Nav&$filter=FuncLocIdIntern eq '${context.binding.FuncLocIdIntern}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', [], filterQuery).then(function(result) {
        if (result && result.length > 0) {
            if (result.getItem(0).FLocBOMs_Nav.length === 0) {
                context.binding.Online = true;
                context.binding.CreateOnlineODataAction = '/SAPAssetManager/Actions/OData/CreateOnlineOData.action';
                context.binding.OpenOnlineServiceAction = '/SAPAssetManager/Actions/OData/OpenOnlineService.action';
                context.showActivityIndicator(context.localizeText('online_search_activityindicator_text'));
                let filterOnlineQuery = `$expand=BOMHeader_Nav/BOMItems_Nav&$filter=FuncLocIdIntern%20eq%20'${context.binding.FuncLocIdIntern}'`;
                return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(function() {
                    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'FunctionalLocationBOMs', [], filterOnlineQuery).then(function(flocBOMresult) {
                        // do the logic
                        context.dismissActivityIndicator();
                        if (flocBOMresult) {
                            context.binding.HC_ROOT_CHILDCOUNT = flocBOMresult.getItem(0).BOMHeader_Nav.BOMItems_Nav.length;
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
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'FunctionalLocationBOMs', [], `$expand=BOMHeader_Nav/BOMItems_Nav&$filter=FuncLocIdIntern eq '${context.binding.FuncLocIdIntern}'`).then(function(results) {
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
