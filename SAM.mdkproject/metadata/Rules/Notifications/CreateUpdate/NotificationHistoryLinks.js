import common from '../../Common/Library/CommonLibrary';
import notif from '../NotificationLibrary';

export default function NotificationHistoryLinks(context) {
    let linkPromises = [];
    var links = [{
        'Property': 'HistoryPriority_Nav',
        'Target':
        {
            'EntitySet': 'Priorities',
            'ReadLink': `Priorities(PriorityType='${context.binding.PriorityType}',Priority='${notif.NotificationCreateUpdatePrioritySegValue(context)}')`,
        },
    }];

    var flocValue = common.getTargetPathValue(context, '#Control:FuncLocHierarchyExtensionControl/#Value');
    var equipmentValue = common.getTargetPathValue(context, '#Control:EquipHierarchyExtensionControl/#Value');
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
    } else if (flocValue && flocValue !== '' && common.isCurrentReadLinkLocal(flocValue)) {
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

    if (linkPromises.length > 0) {
        return Promise.all(linkPromises).then(() => {
            return links;
        });
    }
    return links;
}
