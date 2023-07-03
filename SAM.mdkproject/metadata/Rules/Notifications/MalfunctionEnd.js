import GenerateLocalID from '../Common/GenerateLocalID';
import DocLib from '../Documents/DocumentLibrary';
import documentValidateCreate from '../Documents/DocumentValidation';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

/**
* Run all actions pertaining to Malfunction End/Work Order Complete
* @param {IClientAPI} context
*/
export default function MalfunctionEnd(context) {

    // Create Item Function
    let createItem = function(actionResult) {
        let data = JSON.parse(actionResult.data);

        let localItemNum = GenerateLocalID(context, `${data['@odata.readLink']}/Items`, 'ItemNumber', '0000', '', '');
        let sortNum = GenerateLocalID(context, `${data['@odata.readLink']}/Items`, 'ItemSortNumber', '0000', '', '');
        return Promise.all([localItemNum, sortNum]).then(function(promises) {
            let notificationItemCreateAction = '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreate.action';
            return context.executeAction({'Name': notificationItemCreateAction, 'Properties': {
                'Properties':
                {
                    'NotificationNumber': data.NotificationNumber,
                    'ItemNumber' : promises[0],
                    'ItemText' : context.evaluateTargetPath('#Control:ItemDescription/#Value'),
                    'ObjectPartCodeGroup': context.evaluateTargetPath('#Control:PartGroupLstPkr/#SelectedValue'),
                    'ObjectPart' : context.evaluateTargetPath('#Control:PartDetailsLstPkr/#SelectedValue'),
                    'CodeGroup': context.evaluateTargetPath('#Control:DamageGroupLstPkr/#SelectedValue'),
                    'DamageCode': context.evaluateTargetPath('#Control:DamageDetailsLstPkr/#SelectedValue'),
                    'ItemSortNumber': promises[1],
                },
                'Headers':
                {
                    'OfflineOData.RemoveAfterUpload': 'true',
                    'OfflineOData.TransactionID': data.NotificationNumber,
                },
                'CreateLinks':
                [{
                    'Property' : 'Notification',
                    'Target':
                    {
                        'EntitySet' : 'MyNotificationHeaders',
                        'ReadLink' : data['@odata.readLink'],
                    },
                }],
                'OnSuccess': '',
                'OnFailure': '',
            }});
        }).then(itemResult => {
            let itemData = JSON.parse(itemResult.data);
            // eslint-disable-next-line brace-style
            let itemNote = (function() { try { return context.evaluateTargetPath('#Control:CauseNote/#Value'); } catch (exc) { return ''; } })();

            if (itemNote) {
                return context.executeAction({'Name': '/SAPAssetManager/Actions/Notes/NoteCreateDuringEntityCreate.action', 'Properties': {
                    'Target': {
                        'EntitySet': 'MyNotifItemLongTexts',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                    },
                    'Properties': {
                        'NewTextString': itemNote,
                        'TextString': itemNote,
                    },
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': 'true',
                    },
                    'OnSuccess': '',
                    'OnFailure': '',
                    'CreateLinks': [{
                        'Property': 'NotificationItem',
                        'Target': {
                            'EntitySet': 'MyNotificationItems',
                            'ReadLink': itemData['@odata.readLink'],
                        },
                    }],
                }}).then(() => {
                    return itemResult;
                });
            } else {
                return Promise.resolve(itemResult);
            }
        });
    };

    // Create Cause function
    let createCause = function(actionResult) {
        let data = JSON.parse(actionResult.data);
        let localCauseNum = GenerateLocalID(context, `${data['@odata.readLink']}/ItemCauses`, 'CauseSequenceNumber', '0000', '', '');
        let sortNum = GenerateLocalID(context, `${data['@odata.readLink']}/ItemCauses`, 'CauseSortNumber', '0000', '', '');
        return Promise.all([localCauseNum, sortNum]).then(function(promises) {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreate.action',
                'Properties': {
                    'Properties':
                    {
                        'NotificationNumber': data.NotificationNumber,
                        'ItemNumber' : data.ItemNumber,
                        'CauseSequenceNumber' : promises[0],
                        'CauseText' : context.evaluateTargetPath('#Control:CauseDescription/#Value'),
                        // eslint-disable-next-line brace-style
                        'CauseCodeGroup': (function() { try { return context.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue'); } catch (e) {return '';} })(),
                        // eslint-disable-next-line brace-style
                        'CauseCode' : (function() { try { return context.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue'); } catch (e) {return '';} })(),
                        'CauseSortNumber' : promises[1],
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
                    'OnFailure' : '',
                },
            }).then(causeResult => {
                let causeData = JSON.parse(causeResult.data);
                // eslint-disable-next-line brace-style
                let causeNote = (function() { try { return context.evaluateTargetPath('#Control:CauseNote/#Value'); } catch (exc) { return ''; } })();

                if (causeNote) {
                    return context.executeAction({'Name': '/SAPAssetManager/Actions/Notes/NoteCreateDuringEntityCreate.action', 'Properties': {
                        'Target': {
                            'EntitySet': 'MyNotifItemCauseLongTexts',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                        },
                        'Properties': {
                            'NewTextString': causeNote,
                            'TextString': causeNote,
                        },
                        'Headers': {
                            'OfflineOData.RemoveAfterUpload': 'true',
                        },
                        'OnSuccess': '',
                        'OnFailure': '',
                        'CreateLinks': [{
                            'Property': 'NotificationItemCause',
                            'Target': {
                                'EntitySet': 'MyNotificationItemCauses',
                                'ReadLink': causeData['@odata.readLink'],
                            },
                        }],
                    }}).then(() => {
                        return causeResult;
                    });
                } else {
                    return Promise.resolve(causeResult);
                }
            });
        });
    };

    // eslint-disable-next-line brace-style
    let itemDescription = (function() { try { return context.evaluateTargetPath('#Control:ItemDescription/#Value'); } catch (e) {return '';} })();
    // eslint-disable-next-line brace-style
    let causeDescription = (function() { try { return context.evaluateTargetPath('#Control:CauseDescription/#Value'); } catch (e) {return '';} })();

    return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdateMalfunctionEnd.action').then(actionResult => {
        if (itemDescription) {
            // Create Item
            return createItem(actionResult);
        } else {
            // Resolve promise but don't pass an action result
            return Promise.resolve();
        }
    }).then(actionResult => {
        // If actionResult is null, no don't create a Cause
        if (causeDescription && actionResult) {
            return createCause(actionResult);
        } else {
            return Promise.resolve();
        }
    }).then(() => {
        // Update attachments -- Copied verbatim from DocumentCreateDelete.js because
        // the success message hardcoded into the rule screws things up

        //*************DELETE DOCUMENTS *********************/
        const attachmentFormcell = context.getControl('FormCellContainer').getControl('Attachment');
        const deletedAttachments = attachmentFormcell.getClientData().DeletedAttachments;
        // create an rray with all the readLinks to process
        context.getClientData().DeletedDocReadLinks = deletedAttachments.map((deletedAttachment) => {
            return deletedAttachment.readLink;
        });

        let deletes = deletedAttachments.map(() => {
            //call the delete doc delete action
            return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentDeleteBDS.action');
        });

        return Promise.all(deletes).then(() => {
        //*************CREATE DOCUMENTS *********************/
            const attachmentCount = DocLib.validationAttachmentCount(context);
            if (attachmentCount > 0) {
                return documentValidateCreate(context,'',attachmentFormcell);
            }
            return Promise.resolve();
        });
    }).then(() => {
        if (IsCompleteAction(context)) {
            WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                data: JSON.stringify(context.binding),
                value: context.localizeText('done'),
                link: context.binding['@odata.editLink'],
            });
            return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
        }
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
    }).catch(() => {
        // Failure occurred
        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
    });
}
