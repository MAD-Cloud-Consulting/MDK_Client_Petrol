import libCom from '../../Common/Library/CommonLibrary';
import validateData from './ValidateInboundOrOutboundDelivery';
import updateHeaderStatus from './InboundOrOutboundUpdateHeaderStatus';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function InboundOrOutboundUpdatePost(context) {

    let type = libCom.getStateVariable(context, 'IMObjectType');
    const DeliveryItemsEntitySet = (type === 'IB' ? 'InboundDeliveryItems' : 'OutboundDeliveryItems');
    const DeliveryItem_Nav = (type === 'IB' ? 'InboundDeliveryItem_Nav' : 'OutboundDeliveryItem_Nav');
    const DeliverySerialsEntitySet = (type === 'IB' ? 'InboundDeliverySerials' : 'OutboundDeliverySerials');

    return validateData(context).then(valid => {
        if (valid) { 
            // Pre-set Delivery Item properties, since Batch is optional
            let props = {
                'Plant': context.binding.Plant,
                'StorageLocation': (() => {
                    try {
                        return context.evaluateTargetPath('#Control:StorageLocationPicker/#Value')[0].ReturnValue
                            || context.binding.StorageLocation
                            || '';
                    } catch (exc) {
                        return context.binding.StorageLocation || '';
                    }
                })(),
                'PickedQuantity': (() => {
                    try {
                        return Number(context.evaluateTargetPath('#Control:ConfirmedQuantitySimple/#Value')) || 0;
                    } catch (exc) {
                        return 0;
                    }
                })(),
                'UOM': context.binding.UOM,
            };

            if (context.binding.MaterialPlant_Nav.BatchIndicator) {
                props.Batch = (() => {
                    try {
                        return context.evaluateTargetPath('#Control:BatchSimple/#Value').toUpperCase() || '';
                    } catch (exc) {
                        return '';
                    }
                })();
            }

            try {
                if (context.binding.MaterialPlant_Nav.ValuationCategory) {
                    props.ValuationType = (() => {
                        try {
                            return context.evaluateTargetPath('#Control:ValuationTypePicker/#Value')[0].ReturnValue || '';
                        } catch (exc) {
                            return '';
                        }
                    })();
                }
            } catch (exc) {
                // Do nothing
            }

            try {
                props.StorageBin = context.evaluateTargetPath('#Control:StorageBinSimple/#Value');
            } catch (exc) {
                // Do nothing
            }

            // Update Delivery Item
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryUpdate.action', 'Properties': {
                'Target': {
                    'EntitySet': DeliveryItemsEntitySet,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': context.binding['@odata.readLink'],
                },
                'Properties': props,
                'RequestOptions': {
                    'UpdateMode': 'Replace',
                },
                'Headers': {
                    'OfflineOData.TransactionID': context.binding.DeliveryNum,
                },
            }}).then (() => {
                if (context.binding.MaterialPlant_Nav.SerialNumberProfile) {
                    let serialNumberCreates = [];
                    let serialNumbers;
                    const actualSerials = libCom.getStateVariable(context, 'SerialNumbers').actual;
                    const inoutSerials = context.binding.OutboundDeliverySerial_Nav || context.binding.InboundDeliverySerial_Nav;
                    if (actualSerials && actualSerials.length) {
                        // serialNumbers = actualSerials.filter(item => item.selected);
                        serialNumbers = actualSerials;
                    } else if (inoutSerials.length) {
                        serialNumbers = inoutSerials;
                    }
                    // Create/Update Serial Number records
                    for (let i = 0; i < serialNumbers.length; i ++) {
                        if (serialNumbers[i].new) {
                            serialNumberCreates.push(context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundOutbound/InboundOutboundDeliverySerialCreate.action', 'Properties': {
                                'Target': {
                                    'EntitySet': DeliverySerialsEntitySet,
                                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                                },
                                'Properties': {
                                    'IsDownloaded': '',
                                    'SerialNumber': serialNumbers[i].SerialNumber,
                                },
                                'Headers': {
                                    'OfflineOData.TransactionID': context.binding.DeliveryNum,
                                },
                                'CreateLinks': [{
                                    'Property': DeliveryItem_Nav,
                                    'Target':
                                    {
                                        'EntitySet': DeliveryItemsEntitySet,
                                        'ReadLink': context.binding['@odata.readLink'],
                                    },
                                }],
                            }}));
                        } else {
                            let existingSerialData = inoutSerials.filter(data => data.SerialNumber === serialNumbers[i].SerialNumber);
                            if (existingSerialData && existingSerialData.length) {
                                if ((!libCom.isCurrentReadLinkLocal(existingSerialData[0]['@odata.readLink'])) || serialNumbers[i].selected) {
                                    if (serialNumbers[i].selected) {
                                        serialNumberCreates.push(context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryUpdate.action', 'Properties': {
                                            'Target': {
                                                'EntitySet': DeliverySerialsEntitySet,
                                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                                'ReadLink': existingSerialData[0]['@odata.readLink'],
                                            },
                                            'Properties': {
                                                'IsDownloaded': '',
                                                'Item': existingSerialData[0].Item,
                                                'SerialNumber': serialNumbers[i].SerialNumber,
                                                'DeliveryNum': existingSerialData[0].DeliveryNum,
                                            },
                                            'RequestOptions': {
                                                'UpdateMode': 'Replace',
                                            }, 
                                            'UpdateLinks': [{
                                                'Property': DeliveryItem_Nav,
                                                'Target':
                                                {
                                                    'EntitySet': DeliveryItemsEntitySet,
                                                    'ReadLink': context.binding['@odata.readLink'],
                                                },
                                            }],
                                            'Headers': {
                                                'OfflineOData.TransactionID': context.binding.DeliveryNum,
                                            },
                                        }}));
                                    } else {
                                        if (existingSerialData[0]['@sap.isLocal'] === true) {
                                            serialNumberCreates.push(context.executeAction({
                                                'Name': '/SAPAssetManager/Actions/Common/GenericDiscard.action', 
                                                'Properties': {
                                                    'Target': {
                                                        'EntitySet': DeliverySerialsEntitySet,
                                                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                                                        'EditLink': existingSerialData[0]['@odata.readLink'],
                                                    },
                                                },
                                            }));
                                        }
                                    }
                                } else {
                                    serialNumberCreates.push(context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundOutbound/InboundOutboundDeliverySerialDelete.action', 'Properties': {
                                        'Target': {
                                            'EntitySet': DeliverySerialsEntitySet,
                                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                                            'ReadLink':  existingSerialData[0]['@odata.readLink'],
                                        },
                                        'Properties': {
                                            'SerialNumber': serialNumbers[i].SerialNumber,
                                        },
                                        'DeleteLinks': [{
                                            'Property': DeliveryItem_Nav,
                                            'Target':
                                            {
                                                'EntitySet': DeliveryItemsEntitySet,
                                                'ReadLink': context.binding['@odata.readLink'],
                                            },
                                        }],
                                    }}));
                                }
                            } else {
                                return Promise.resolve();
                            }
                        }
                    }
                    return Promise.all(serialNumberCreates);
                } else {
                    return Promise.resolve();
                } 
            }).then (() => {
                return updateHeaderStatus(context, context.binding.DeliveryNum);
            }).then(() => {
                return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action').then(() => {
                    libCom.removeStateVariable(context, 'MaterialPlantValue');
                    libCom.removeStateVariable(context, 'MaterialSLocValue');
                    libCom.removeStateVariable(context, 'BatchRequiredForFilterADHOC');
                }).catch(() => {
                    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
                });
            });
        }
        return false;
    });
}
