import libCommon from '../../Common/Library/CommonLibrary';
import ChangesetSwitchReadLink from '../../Common/ChangeSet/ChangesetSwitchReadLink';

export default function NotificationQMCreateLinks(context) {
    let links = [];

    if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' && context.binding.InspectionLot_Nav) {
        links.push({
            'Property' : 'InspectionChar_Nav',
            'Target':
            {
                'EntitySet' : 'InspectionCharacteristics',
                'ReadLink' : context.binding['@odata.readLink'],
            },
        });

     if (context.binding.InspectionPoint_Nav) {
        links.push({
            'Property' : 'InspectionPoint_Nav',
            'Target':
            {
                'EntitySet' : 'InspectionPoints',
                'ReadLink' : context.binding.InspectionPoint_Nav['@odata.readLink'],
            },
        });
     }  

        if (context.binding.InspectionPoint_Nav && context.binding.InspectionPoint_Nav.Equip_Nav) {
            links.push({
                'Property' : 'Equipment',
                'Target':
                {
                    'EntitySet' : 'MyEquipments',
                    'ReadLink' : context.binding.InspectionPoint_Nav.Equip_Nav['@odata.readLink'],
                },
            });
        }
        if (context.binding.InspectionPoint_Nav && context.binding.InspectionPoint_Nav.FuncLoc_Nav) {
            links.push({
                'Property' : 'FunctionalLocation',
                'Target':
                {
                    'EntitySet' : 'MyFunctionalLocations',
                    'ReadLink' : context.binding.InspectionPoint_Nav.FuncLoc_Nav['@odata.readLink'],
                },
            });
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
            /*
            * NotificationReadLink is used if QM Notification + Item will be created
            * NotificationQueryOpts is used if only an Item will be created
            */
            let NotificationReadLink = '';
            let NotificationQueryOpts = '';
            if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
                NotificationReadLink = context.binding['@odata.readLink'];
            } else if (libCommon.isOnChangeset(context)) {
                NotificationReadLink = 'pending_1';
            } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                if (result.getItem(0).OneQNotifPerLotFlag === 'X') {
                    NotificationQueryOpts = `$filter=Items/any(itm: itm/InspectionChar_Nav/InspectionLot eq '${context.binding.InspectionLot}')`;
                } else {
                    NotificationQueryOpts = `$filter=Items/any(itm: itm/InspectionChar_Nav/InspectionLot eq '${context.binding.InspectionLot}' and itm/InspectionChar_Nav/InspectionNode eq '${context.binding.InspectionNode}' and itm/InspectionChar_Nav/SampleNum eq '${context.binding.SampleNum}')`;
                }
            }

            if (NotificationReadLink) {
                links.push({
                    'Property' : 'Notification',
                    'Target':
                    {
                        'EntitySet' : 'MyNotificationHeaders',
                        'ReadLink' : NotificationReadLink,
                    },
                });
            } else if (NotificationQueryOpts) {
                links.push({
                    'Property' : 'Notification',
                    'Target':
                    {
                        'EntitySet' : 'MyNotificationHeaders',
                        'QueryOptions' : NotificationQueryOpts,
                    },
                });
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${result.getItem(0).QMNotifType}')`, [], '').then(result2 => {
                let catalog = result2.getItem(0).CatTypeDefects;
                return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='${catalog}',CodeGroup='${context.evaluateTargetPath('#Control:DamageGroupLstPkr/#SelectedValue')}',Code='${context.evaluateTargetPath('#Control:DamageDetailsLstPkr/#SelectedValue')}')/DefectClass_Nav`, [], '').then(result3 => {
                    if (result3.length > 0) {
                        links.push({
                            'Property' : 'DefectClass_Nav',
                            'Target':
                            {
                                'EntitySet' : 'DefectClasses',
                                'ReadLink' : result3.getItem(0)['@odata.readLink'],
                            },
                        });
                    }
                    return links;
                });
            });
        });
    } else {
        links.push({
            'Property' : 'Notification',
            'Target':
            {
                'EntitySet' : 'MyNotificationHeaders',
                'ReadLink' : ChangesetSwitchReadLink(context),
            },
        });
        return links;
    }
}
