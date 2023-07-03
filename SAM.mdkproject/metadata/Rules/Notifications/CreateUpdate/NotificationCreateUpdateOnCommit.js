import ComLib from '../../Common/Library/CommonLibrary';
import valLib from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import NotificationUpdateSuccess from '../CreateUpdate/NotificationUpdateSuccess';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import GetPlanningPlant from '../../Common/GetPlanningPlant';
import GenerateNotificationID from '../GenerateNotificationID';
import NotificationLibrary from '../NotificationLibrary';
import BreakdownSwitchValue from '../BreakdownSwitchValue';
import NotificationCreateUpdateQMCodeGroupValue from './NotificationCreateUpdateQMCodeGroupValue';
import NotificationCreateUpdateQMCodeValue from './NotificationCreateUpdateQMCodeValue';
import NotificationCreateUpdateQMCatalog from './NotificationCreateUpdateQMCatalog';
import NotificationCreateSuccess from './NotificationCreateSuccess';
import GetMalfunctionStartDate from '../MalfunctionStartDate';
import GetMalfunctionStartTime from '../MalfunctionStartTime';
import GetMalfunctionEndDate from '../MalfunctionEndDate';
import GetMalfunctionEndTime from '../MalfunctionEndTime';
import GetCurrentDate from '../../Confirmations/BlankFinal/GetCurrentDate';

export default function NotificationCreateUpdateOnCommit(clientAPI) {

    // Prevent double-pressing done button
    clientAPI.showActivityIndicator('');

    //Determine if we are on edit vs. create
    let onCreate = ComLib.IsOnCreate(clientAPI);
    let type = ComLib.getListPickerValue(clientAPI.getControls()[0].getControl('TypeLstPkr').getValue());
    ComLib.setStateVariable(clientAPI, 'NotificationType', type); // Saving type to later use for EAMOverallStatusConfigs
    let descr = clientAPI.getControls()[0].getControl('NotificationDescription').getValue();
    let breakdownStart = ComLib.getControlProxy(clientAPI,'BreakdownStartSwitch').getValue();
    let breakdownEnd = ComLib.getControlProxy(clientAPI,'BreakdownEndSwitch').getValue();
    let notifCategoryPromise = NotificationLibrary.getNotificationCategory(clientAPI,type).then(notifCategory => {
        ComLib.setStateVariable(clientAPI, 'NotificationCategory', notifCategory);
        return notifCategory;
    });

    if (onCreate) {
        // If we're creating a Notification, we will always be doing a ChangeSet
        ComLib.setStateVariable(clientAPI, 'ObjectCreatedName', 'Notification');
        if (!valLib.evalIsEmpty(type) && !valLib.evalIsEmpty(descr)) {
            let promises = [];
            promises.push(GenerateNotificationID(clientAPI));
            promises.push(NotificationLibrary.NotificationCreateMainWorkCenter(clientAPI));

            if (IsPhaseModelEnabled(clientAPI)) {
                promises.push(NotificationCreateUpdateQMCatalog(clientAPI));
            }
            
            promises.push(notifCategoryPromise);
            promises.push(NotificationLibrary.NotificationCreateUpdateFunctionalLocationLstPkrValue(clientAPI));
            promises.push(NotificationLibrary.NotificationCreateUpdateEquipmentLstPkrValue(clientAPI));

            return Promise.all(promises).then(results => {
                ////The number of promises is different when phase model is on we need to re-arrange the order
                let notifNum = results[0];
                let workcenter = results[1];
                let qmcatalog = '';
                let floc = results[3];
                let equip = results[4];
                if (IsPhaseModelEnabled(clientAPI)) {
                    qmcatalog = results[2];
                    floc = results[4];
                    equip = results[5];
                }
                
                
                let notificationCreateProperties = {
                    'PlanningPlant': GetPlanningPlant(),
                    'NotificationNumber' : notifNum,
                    'NotificationDescription' : descr,
                    'NotificationType' : type,
                    'Priority' : NotificationLibrary.NotificationCreateUpdatePrioritySegValue(clientAPI),
                    'HeaderFunctionLocation' : floc,
                    'HeaderEquipment' : equip,
                    'BreakdownIndicator' : BreakdownSwitchValue(clientAPI),
                    'MainWorkCenter' : workcenter,
                    'MainWorkCenterPlant': NotificationLibrary.NotificationCreateMainWorkCenterPlant(clientAPI),
                    'ReportedBy': ComLib.getSapUserName(clientAPI),
                    'CreationDate': GetCurrentDate(clientAPI),
                };

                if (IsPhaseModelEnabled(clientAPI)) {
                    notificationCreateProperties.QMCodeGroup = NotificationCreateUpdateQMCodeGroupValue(clientAPI);
                    notificationCreateProperties.QMCode = NotificationCreateUpdateQMCodeValue(clientAPI);
                    notificationCreateProperties.QMCatalog = qmcatalog;
                }

                if (breakdownStart) {
                    notificationCreateProperties.MalfunctionStartDate = GetMalfunctionStartDate(clientAPI);
                    notificationCreateProperties.MalfunctionStartTime = GetMalfunctionStartTime(clientAPI);
                }

                if (breakdownEnd) {
                    notificationCreateProperties.MalfunctionEndDate = GetMalfunctionEndDate(clientAPI);
                    notificationCreateProperties.MalfunctionEndTime = GetMalfunctionEndTime(clientAPI);
                }

                //Update property InspectionLot.
                if (clientAPI.binding && clientAPI.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                    notificationCreateProperties.InspectionLot = clientAPI.binding.InspectionLot;
                }

                return clientAPI.executeAction({
                    'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreate.action',
                    'Properties': {
                        'Properties': notificationCreateProperties,
                        'Headers':
                        {
                            'OfflineOData.RemoveAfterUpload': 'true',
                            'OfflineOData.TransactionID': notifNum,
                        },
                    },
                }).then(actionResult => {
                    // Store created notification
                    ComLib.setStateVariable(clientAPI, 'CreateNotification', JSON.parse(actionResult.data));
                    return NotificationCreateSuccess(clientAPI, JSON.parse(actionResult.data));
                }).catch(() => {
                    clientAPI.dismissActivityIndicator();
                    return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
                });
            }).catch(err => {
                Logger.error('Notification', err);
                clientAPI.dismissActivityIndicator();
                return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
            });

        } else {
            clientAPI.dismissActivityIndicator();
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'One of the required controls did not return a value OnCreate');
            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
        }
    } else {
        let promises = [];
        if (IsPhaseModelEnabled(clientAPI)) {
            promises.push(NotificationCreateUpdateQMCatalog(clientAPI));
        }
        promises.push(notifCategoryPromise);
        return Promise.all(promises).then(results => {
            let notificationUpdateProperties = {
                'NotificationDescription' : descr,
                'NotificationType' : type,
                'Priority' : NotificationLibrary.NotificationCreateUpdatePrioritySegValue(clientAPI),
                'HeaderFunctionLocation' : NotificationLibrary.NotificationCreateUpdateFunctionalLocationLstPkrValue(clientAPI),
                'HeaderEquipment' : NotificationLibrary.NotificationCreateUpdateEquipmentLstPkrValue(clientAPI),
                'BreakdownIndicator' : BreakdownSwitchValue(clientAPI),
            };

            if (breakdownStart) {
                notificationUpdateProperties.MalfunctionStartDate = GetMalfunctionStartDate(clientAPI);
                notificationUpdateProperties.MalfunctionStartTime = GetMalfunctionStartTime(clientAPI);
            }

            if (breakdownEnd) {
                notificationUpdateProperties.MalfunctionEndDate = GetMalfunctionEndDate(clientAPI);
                notificationUpdateProperties.MalfunctionEndTime = GetMalfunctionEndTime(clientAPI);
            }

            if (IsPhaseModelEnabled(clientAPI)) {
                notificationUpdateProperties.QMCodeGroup = NotificationCreateUpdateQMCodeGroupValue(clientAPI);
                notificationUpdateProperties.QMCode = NotificationCreateUpdateQMCodeValue(clientAPI);
                notificationUpdateProperties.QMCatalog = results[0];
            }
            return clientAPI.executeAction({
                'Name' : '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdate.action',
                'Properties': {
                    'Properties': notificationUpdateProperties,
                    'OnSuccess' : '',
                },
            }).then(() => {
                // eslint-disable-next-line brace-style
                let createItem = !!(function() { try { return (clientAPI.evaluateTargetPath('#Control:PartDetailsLstPkr/#SelectedValue') && clientAPI.evaluateTargetPath('#Control:PartGroupLstPkr/#SelectedValue')); } catch (exc) { return ''; } })();
                if (createItem) {
                    return clientAPI.executeAction({
                        'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreate.action',
                        'Properties': {
                            'OnSuccess' : '',
                        },
                    });
                } else {
                    return Promise.reject(); // Skip item and cause create
                }
            }).then(actionResult => {
                // eslint-disable-next-line brace-style
                let createCause = !!(function() { try { return (clientAPI.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue') && clientAPI.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue')); } catch (exc) { return ''; } })();
                if (createCause) {
                    let data = JSON.parse(actionResult.data);
                    return clientAPI.executeAction({
                        'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreate.action',
                        'Properties': {
                            'Properties':
                            {
                                'NotificationNumber': data.NotificationNumber,
                                'ItemNumber' : data.ItemNumber,
                                'CauseSequenceNumber' : '0001',
                                'CauseText' : clientAPI.evaluateTargetPath('#Control:CauseDescription/#Value') || '',
                                // eslint-disable-next-line brace-style
                                'CauseCodeGroup': (function() { try { return clientAPI.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue'); } catch (e) {return '';} })(),
                                // eslint-disable-next-line brace-style
                                'CauseCode' : (function() { try { return clientAPI.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue'); } catch (e) {return '';} })(),
                                'CauseSortNumber' : '0001',
                            },
                            'Headers':
                            {
                                'OfflineOData.RemoveAfterUpload': 'true',
                                'OfflineOData.TransactionID': data.NotificationNumber,
                            },
                            'CreateLinks':
                            [{
                                'Property' : 'Item',
                                'Target':
                                {
                                    'EntitySet' : 'MyNotificationItems',
                                    'ReadLink' : data['@odata.readLink'],
                                },
                            }],
                            'OnSuccess' : '',
                        },
                    });
                } else {
                    return Promise.reject(); // Skip cause create
                }
            }).catch(() => {
                return Promise.resolve(); // Continue action chain
            }).then(() => {
                return NotificationUpdateSuccess(clientAPI);
            });
        }).catch(() => {
            clientAPI.dismissActivityIndicator();
            return clientAPI.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        });
    }
}
