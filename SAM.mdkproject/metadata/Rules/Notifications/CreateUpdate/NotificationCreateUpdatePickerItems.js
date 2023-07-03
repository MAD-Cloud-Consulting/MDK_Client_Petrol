import updateGroupPickers from './UpdateGroupPickers';
import libVal from '../../Common/Library/ValidationLibrary';
export default function NotificationCreateUpdatePickerItems(context) {
    let controlName = context.getName();
    let formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    let extensionPromise = Promise.resolve();
    // TODO: Remove this workaround when we get the hierarchy list picker support from sdk.
    // If user select a child from a hierarchy, we are losing the pageProxy binding so have to check and re-assign it.
    if (libVal.evalIsEmpty(context.getPageProxy().binding)) {
        context.getPageProxy()._context.binding = context.binding;
    }
    // Based on the control we are on, return the right list items accordingly
    switch (controlName) {
        case 'FuncLocHierarchyExtensionControl':
            {
                let funcLocControlValue = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
                let equipmentControlValue = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
                let extension = formCellContainer.getControl('EquipHierarchyExtensionControl')._control._extension;
                extensionPromise = extension.reload().then(() => {
                    if (funcLocControlValue && equipmentControlValue) {
                        extension.setData(equipmentControlValue);
                    }
                    return Promise.resolve(true);
                });
                break;
            }
        case 'EquipHierarchyExtensionControl':
            {
    
                let equipmentControlValue = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
                let extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control._extension;
                if (equipmentControlValue) {
                    extensionPromise = context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['FuncLocIdIntern'], `$orderby=EquipId&$filter=EquipId eq '${equipmentControlValue}'&$expand=FunctionalLocation`).then( results => {
                        if (results.length > 0 && results.getItem(0).FuncLocIdIntern) {
                            extension.setData(results.getItem(0).FuncLocIdIntern);
                        }
                        return Promise.resolve(true);
                    });
                }
                extensionPromise = Promise.resolve(true);
            }
            break;
        default:
            break;
    }

    // If priority matrix selection is enabled, check to see if button should be displayed

    // Clear EMP data
    delete context.getPageProxy().getClientData().EMP;
    let type = (() => {
        try {
            return context.getPageProxy().evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue');
        } catch (exc) {
            return '';
        }
    })();
    let equipment = (() => {
        try {
            return formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
        } catch (exc) {
            return '';
        }
    })();
    let floc = (() => {
        try {
            return formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
        } catch (exc) {
            return '';
        }
    })();

    if (type && context.getValue()[0]) {
        // Get Equipment and Functional Location plants
        let equipRead = context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${equipment}')`, [], '$select=MaintPlant').then(result => result.getItem(0).MaintPlant).catch(() => '');
        let flocRead = context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${floc}')`, [], '$select=MaintPlant').then(result => result.getItem(0).MaintPlant).catch(() => '');

        // Force visibility check to run after target specifiers have finished
        return Promise.all([flocRead, equipRead, extensionPromise]).then(results => {
            context.getPageProxy()._context.binding = context.binding;
            // Get Plant from FLOC or Equipment, otherwise empty
            let plant = results[0] || results[1] || '';
            if (plant) {
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'ConsequenceCategories', `$filter=ConsequenceGroup_Nav/PrioritizationProfile_Nav/PrioritizationProfileLink_Nav/any(ppl:ppl/NotificationType eq '${type}' and ppl/Plant eq '${plant}')`).then(count => {
                    return context.getPageProxy().evaluateTargetPath('#Control:AssessmentBtn').setVisible(count > 0);
                });
            } else {
                return context.getPageProxy().evaluateTargetPath('#Control:AssessmentBtn').setVisible(false);
            }
        }).then(() => updateGroupPickers(context.getPageProxy()));
    } else {
        return Promise.resolve();
    }
}
