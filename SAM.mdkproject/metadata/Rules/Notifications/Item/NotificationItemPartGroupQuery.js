import notification from '../NotificationLibrary';
import common from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function NotificationItemPartGroupQuery(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
            let binding = context.getPageProxy().binding;

            let notifLookup = Promise.resolve(binding.NotificationType);

            if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
                if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem') {
                    binding = binding.Notification;
                    notifLookup = Promise.resolve(binding.NotificationType);
                } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                    notifLookup = context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}',OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}')`, [], '').then(result => {
                        return result.getItem(0).QMNotifType;
                    });
                    binding.MainWorkCenter = binding.InspectionLot_Nav.WOHeader_Nav.WorkCenterInternalId;
                } else {
                    let createNotification = common.getStateVariable(context, 'CreateNotification');
                    if (createNotification) {
                        binding = createNotification;
                        notifLookup = Promise.resolve(binding.NotificationType);
                    }
                }
            }
            return notifLookup.then(type => {
                return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${type}')`, [], '').then(notifType => {
                    if (notifType.getItem(0).NotifCategory === '02') { // QM Notification
                        return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], `$filter=WorkCenterId eq '${binding.MainWorkCenter}'`).then(workcenter => {
                            if (workcenter.length > 0 && workcenter.getItem(0).QNotifTypeFlag !== 'X') { // Read from Workcenter
                                return `$filter=CatalogProfile eq '${workcenter.getItem(0).CatalogProfile}' and Catalog eq '${notifType.getItem(0).CatTypeObjectParts}'`;
                            } else { // Read from Notification Type
                                return `$filter=CatalogProfile eq '${notifType.getItem(0).CatalogProfile}' and Catalog eq '${notifType.getItem(0).CatTypeObjectParts}'`;
                            }
                        });
                    } else { // PM Notification
                        let defect = (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' || (binding.InspectionLot && Number(binding.InspectionLot) !== 0)); // Are we working with a Defect Notification or not?
                        if (!defect) { // Standard PM Notification
                            return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeObjectParts');
                        } else { // Defect PM Notification
                            return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], `$filter=WorkCenterId eq '${binding.MainWorkCenter}'`).then(workcenter => {
                                if (workcenter.length > 0) {
                                    let reads = [];

                                    if (workcenter.getItem(0).PMEquipFlag === 'X' && binding.HeaderEquipment) { // Check if reading from Equipment is allowed
                                        reads.push(context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${binding.HeaderEquipment}')`, [], ''));
                                    }
                                    if (workcenter.getItem(0).PMFuncLocFlag === 'X' && binding.HeaderFunctionLocation) { // Check if reading from FLOC is allowed
                                        reads.push(context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${binding.HeaderFunctionLocation}')`, [], ''));
                                    }

                                    return Promise.all(reads).then(readResultsArray => {
                                        for (let i = 0; i < readResultsArray.length; i ++) {
                                            if (readResultsArray[i].length > 0) { // If Equipment or FLOC is present, return early with respective Catalog Profile
                                                return `$filter=CatalogProfile eq '${readResultsArray[i].getItem(0).CatalogProfile}' and Catalog eq '${notifType.getItem(0).CatTypeObjectParts}'`;
                                            }
                                        }
                                        // Otherwise return with Workcenter Catalog Profile
                                        return `$filter=CatalogProfile eq '${workcenter.getItem(0).CatalogProfile}' and Catalog eq '${notifType.getItem(0).CatTypeObjectParts}'`;
                                    });
                                } else {
                                    return '';
                                }
                            });
                        }
                    }
                });
            });
    } else {
        return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeObjectParts');
    }
}
