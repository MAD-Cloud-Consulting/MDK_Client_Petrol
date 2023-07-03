import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import common from '../../Common/Library/CommonLibrary';

export default function NotificationLinksDelete(context) {

    var flocValue = common.getTargetPathValue(context, '#Control:FuncLocHierarchyExtensionControl/#Value');
    var equipmentValue = common.getTargetPathValue(context, '#Control:EquipHierarchyExtensionControl/#Value');
    let effectValue = common.getListPickerValue(common.getTargetPathValue(context, '#Control:EffectListPicker/#Value'));
    let detectionGroup = common.getListPickerValue(common.getTargetPathValue(context, '#Control:DetectionGroupListPicker/#Value'));
    let detectionMethod = common.getListPickerValue(common.getTargetPathValue(context, '#Control:DetectionMethodListPicker/#Value'));

    // Edge cases require a re-read of the Functional Location and Equipment since the $expand query does not auto-update
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=Equipment,FunctionalLocation').then(function(result) {
        let binding = {};
        var links = [];
        if (result && (binding = result.getItem(0))) {
            if (!flocValue && binding.FunctionalLocation) {
                links.push({
                    'Property': 'FunctionalLocation',
                    'Target':
                    {
                        'EntitySet': 'MyFunctionalLocations',
                        'ReadLink': binding.FunctionalLocation['@odata.readLink'],
                    },
                });
            }
            if (!equipmentValue && binding.Equipment) {
                links.push({
                    'Property': 'Equipment',
                    'Target':
                    {
                        'EntitySet': 'MyEquipments',
                        'ReadLink': binding.Equipment['@odata.readLink'],
                    },
                });
            }

            if (IsPhaseModelEnabled(context)) {
                if (!effectValue && binding.Effect_Nav) {
                    let effectLink = context.createLinkSpecifierProxy('Effect_Nav', 'Effects', '', binding.Effect_Nav['@odata.readLink']);
                    links.push(effectLink.getSpecifier());
                }
    
                if (!detectionGroup && binding.DetectionGroup_Nav) {
                    let detectionGroupLink = context.createLinkSpecifierProxy('DetectionGroup_Nav','DetectionGroups', '', binding.DetectionGroup_Nav['@odata.readLink']);
                    links.push(detectionGroupLink.getSpecifier());
                }
    
                if (!detectionMethod && binding.DetectionCode_Nav) {
                    let detectionMethodLink = context.createLinkSpecifierProxy('DetectionCode_Nav', 'DetectionCodes', '', binding.DetectionCode_Nav['@odata.readLink']);
                    links.push(detectionMethodLink.getSpecifier());
                }
            }

            return links;
        } else {
            return [];
        }
    });
    
}
