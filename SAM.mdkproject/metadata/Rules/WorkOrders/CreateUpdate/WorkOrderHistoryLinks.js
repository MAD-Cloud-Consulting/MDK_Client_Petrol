import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderHistoryLinks(context) {
    var links = [];
    var flocValue = common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:FuncLocHierarchyExtensionControl/#Value');
    var equipmentValue = common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:EquipHierarchyExtensionControl/#Value');
    if (equipmentValue && equipmentValue !== '' && !common.isCurrentReadLinkLocal(equipmentValue)) {
        links.push({
            'Property': 'Equipment_Nav',
            'Target':
            {
                'EntitySet': 'MyEquipments',
                'ReadLink': `MyEquipments('${equipmentValue}')`,
            },
        });
    } else if (flocValue && flocValue !== '' && !common.isCurrentReadLinkLocal(flocValue)) {
        links.push({
            'Property': 'FuncLoc_Nav',
            'Target':
            {
                'EntitySet': 'MyFunctionalLocations',
                'ReadLink': `MyFunctionalLocations('${flocValue}')`,
            },
        });
    
    }
    var planningPlantValue = common.getListPickerValue(common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:PlanningPlantLstPkr/#Value'));
    var orderTypeValue = common.getListPickerValue(common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:TypeLstPkr/#Value'));
    var priorityValue = common.getListPickerValue(common.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:PrioritySeg/#Value'));
    let linkPromises = [];
    linkPromises.push(
        context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['PriorityType'], `$filter=PlanningPlant eq '${planningPlantValue}' and OrderType eq '${orderTypeValue}'`).then(orderTypes => {
        if (orderTypes.getItem(0)) {
            let priorityType = orderTypes.getItem(0).PriorityType;
            if (!libVal.evalIsEmpty(priorityValue) && !libVal.evalIsEmpty(priorityType)) {
                let priorityLink = context.createLinkSpecifierProxy(
                    'HistoryPriority',
                    'Priorities',
                    `$filter=PriorityType eq '${priorityType}' and Priority eq '${priorityValue}'`
                );
                links.push(priorityLink.getSpecifier());
            }
        }
        return links;
    }));
    if (equipmentValue && equipmentValue !== '' && common.isCurrentReadLinkLocal(equipmentValue)) {
        linkPromises.push(
            common.getEntityProperty(context, `MyEquipments(${equipmentValue})`, 'EquipId').then(equipmentId => {
                let equipmentLink = context.createLinkSpecifierProxy(
                    'Equipment_Nav',
                    'MyEquipments',
                    `$filter=EquipId eq '${equipmentId}'`
                );
                links.push(equipmentLink.getSpecifier());
                return links;
            })
        );
    }
    if (flocValue && flocValue !== '' && common.isCurrentReadLinkLocal(flocValue)) {
        linkPromises.push(
            common.getEntityProperty(context, `MyFunctionalLocations(${flocValue})`, 'FuncLocIdIntern').then(funcLocId => {
                let flocLink = context.createLinkSpecifierProxy(
                    'FuncLoc_Nav',
                    'MyFunctionalLocations',
                    `$filter=FuncLocIdIntern eq '${funcLocId}'`
                );
                links.push(flocLink.getSpecifier());
                return links;
            })
        );
    }
    return Promise.all(linkPromises).then(() => {
        return links;
    });
}
