
import { TransactionNoteType as TransactionNoteType } from '../../Notes/NoteLibrary';
import NoteUtils from '../Utils/NoteUtils';
import libCommon from '../../Common/Library/CommonLibrary';
import DocLib from '../../Documents/DocumentLibrary';
import lamCopy from './NotificationItemCreateLAMCopy';
import libNotif from '../../Notifications/NotificationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

function PartnerAddressLinks(context, partnerNum, partnerFunction) {
    let entitySet = '';
    let queryNav = '';
    let addressEntitySet = '';

    switch (partnerFunction) {
        case 'SP':
            entitySet = `Customers('${partnerNum}')`;
            queryNav = 'Address_Nav';
            addressEntitySet = 'Addresses';
            break;
        case 'VN':
            entitySet = `Vendors('${partnerNum}')`;
            queryNav = 'Address_Nav';
            addressEntitySet = 'Addresses';
            break;
        case 'AO':
        case 'KU':
        case 'VU':
            entitySet = `SAPUsers('${partnerNum}')`;
            queryNav = 'AddressAtWork_Nav';
            addressEntitySet = 'AddressesAtWork';
            break;
        default:
            break;
    }
    if (entitySet) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], `$expand=${queryNav}`).then((result) => {
            if (result.length > 0) {
                let entity = result.getItem(0);
                if (entity[queryNav]) {
                    return {
                        'Property' : queryNav,
                        'Target':
                        {
                            'EntitySet': addressEntitySet,
                            'ReadLink': entity[queryNav]['@odata.readLink'],
                        },
                    };
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }).catch(() => Promise.resolve(null));
    } else {
        return Promise.resolve(null);
    }
}

export default function NotificationCreateSuccess(context, createdNotif) {

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', [], `$orderby=PartnerFunction&$expand=PartnerFunction_Nav&$top=2&$filter=NotifType eq '${context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue')}' and PartnerIsMandatory eq 'X' and sap.entityexists(PartnerFunction_Nav)`).then(data => {
        let partnerPromises = [];
        // Add additional required partners if necessary
        for (let i = 0; i < data.length; i ++) {
            const partnerFunction = data.getItem(i).PartnerFunction_Nav.PartnerFunction;
            if (context.evaluateTargetPathForAPI(`#Control:PartnerPicker${i+1}`).visible) {
                const partnerNum = context.evaluateTargetPath(`#Control:PartnerPicker${i+1}/#SelectedValue`);
                partnerPromises.push(PartnerAddressLinks(context, partnerNum, partnerFunction).then(partnerAddrLink => {
                    let links = [{
                        'Property' : 'Notification',
                        'Target':
                        {
                            'EntitySet': 'MyNotificationHeaders',
                            'ReadLink': createdNotif['@odata.readLink'],
                        },
                    },
                    {
                        'Property': 'PartnerFunction_Nav',
                        'Target': {
                            'EntitySet': 'PartnerFunctions',
                            'ReadLink': `PartnerFunctions('${partnerFunction}')`,
                        },
                    }];
                    if (partnerAddrLink) {
                        links.push(partnerAddrLink);
                    }
                    return context.executeAction({'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationPartnerCreate.action', 'Properties': {
                        'Properties': {
                            'NotificationNumber': createdNotif.NotificationNumber,
                            'PartnerFunction': partnerFunction,
                            'PartnerNum': partnerNum,
                        },
                        'Headers': {
                            'OfflineOData.RemoveAfterUpload': 'true',
                            'OfflineOData.TransactionID': createdNotif.NotificationNumber,
                        },
                        'CreateLinks': links,
                    }});
                }));
            }
        }
        return Promise.all(partnerPromises);
    }).then(() => {
        // Add VW partner for assignment type 1
        if (libCommon.getNotificationAssignmentType(context) === '1') {
            const partnerNum = libCommon.removeLeadingZeros(libCommon.getPersonnelNumber());
            return PartnerAddressLinks(context, partnerNum, 'VW').then(partnerAddrLink => {
                let links = [{
                    'Property' : 'Notification',
                    'Target':
                    {
                        'EntitySet': 'MyNotificationHeaders',
                        'ReadLink': createdNotif['@odata.readLink'],
                    },
                },
                {
                    'Property': 'PartnerFunction_Nav',
                    'Target': {
                        'EntitySet': 'PartnerFunctions',
                        'ReadLink': "PartnerFunctions('VW')",
                    },
                }];
                if (partnerAddrLink) {
                    links.push(partnerAddrLink);
                }
                return context.executeAction({'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationPartnerCreate.action', 'Properties': {
                    'Properties': {
                        'NotificationNumber': createdNotif.NotificationNumber,
                        'PartnerFunction': 'VW',
                        'PartnerNum': partnerNum,
                    },
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': 'true',
                        'OfflineOData.TransactionID': createdNotif.NotificationNumber,
                    },
                    'CreateLinks': links,
                }});
            });
        }
        return Promise.resolve();
    }).then(() => {
        let descriptionCtrl = context.getControl('FormCellContainer').getControl('AttachmentDescription').getValue();
        let attachmentCtrl = context.getControl('FormCellContainer').getControl('Attachment').getClientData().AddedAttachments;
        libCommon.setStateVariable(context, 'DocDescription', descriptionCtrl);
        libCommon.setStateVariable(context, 'Doc', attachmentCtrl);
        libCommon.setStateVariable(context, 'ObjectKey', 'NotificationNumber');
        libCommon.setStateVariable(context, 'entitySet', 'MyNotifDocuments');
        libCommon.setStateVariable(context, 'parentEntitySet', 'MyNotificationHeaders');
        libCommon.setStateVariable(context, 'parentProperty', 'NotifHeader');
        libCommon.setStateVariable(context, 'attachmentCount', DocLib.validationAttachmentCount(context));
        libCommon.setStateVariable(context, 'Class', libCommon.getStateVariable(context, 'NotificationCategory')); 
    }).then(() => {
        // Save EMP data into a state variable
        if (context.getClientData().EMP) {
            libCommon.setStateVariable(context, 'EMP', context.getClientData().EMP);
        }
        if ((libNotif.getAddFromOperationFlag(context) || libNotif.getAddFromSuboperationFlag(context)) && (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/NotificationHistories.global').getValue()))) {
            return context.executeAction('/SAPAssetManager/Actions/Notifications/RelatedNotifications/RelatedNotificationCreate.action').then(function() {
                return NoteUtils.createNoteIfDefined(context, TransactionNoteType.notification());
            });
        } else {
            return NoteUtils.createNoteIfDefined(context, TransactionNoteType.notification());
        }
    }).then(() => {
        // eslint-disable-next-line brace-style
        let createItem = !!(function() { try { return (context.evaluateTargetPath('#Control:PartDetailsLstPkr/#SelectedValue') && context.evaluateTargetPath('#Control:PartGroupLstPkr/#SelectedValue')); } catch (exc) { return ''; } })();
        if (createItem) {
            let links = [{
                'Property' : 'Notification',
                'Target':
                {
                    'EntitySet' : 'MyNotificationHeaders',
                    'ReadLink' : '/SAPAssetManager/Rules/Common/ChangeSet/ChangesetSwitchReadLink.js',
                },
            }];
            if (context.binding && context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                links.push({
                    'Property' : 'InspectionChar_Nav',
                    'Target':
                    {
                        'EntitySet' : 'InspectionCharacteristics',
                        'ReadLink' : context.binding['@odata.readLink'],
                    },
                });
            }
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreate.action',
                'Properties': {
                    'OnSuccess' : '',
                },
                'CreateLinks': links,
            });
        } else {
            return Promise.reject({'skip': true}); // Skip item and cause create
        }
    }).then(actionResult => {
        // eslint-disable-next-line brace-style
        let createCause = !!(function() { try { return (context.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue') && context.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue')); } catch (exc) { return ''; } })();
        if (createCause) {
            let data = JSON.parse(actionResult.data);
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreate.action',
                'Properties': {
                    'Properties':
                    {
                        'NotificationNumber': data.NotificationNumber,
                        'ItemNumber' : data.ItemNumber,
                        'CauseSequenceNumber' : '0001',
                        'CauseText' : context.evaluateTargetPath('#Control:CauseDescription/#Value') || '',
                        // eslint-disable-next-line brace-style
                        'CauseCodeGroup': (function() { try { return context.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue'); } catch (e) {return '';} })(),
                        // eslint-disable-next-line brace-style
                        'CauseCode' : (function() { try { return context.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue'); } catch (e) {return '';} })(),
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
            return Promise.reject({'skip': true}); // Skip cause create
        }
    }).catch((result) => {
        if (result.skip) {
            return Promise.resolve(); // Continue promise chain if not creating Item/Cause
        } else {
            return Promise.reject(result);
        }
    }).then(() => {
        return lamCopy(context);
    }).then(() => {
        context.dismissActivityIndicator();
        if (context.binding && context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsNotificationSuccessMessageClosePage.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
    }).catch(() => {
        context.dismissActivityIndicator();
        return Promise.reject();
    });
}
