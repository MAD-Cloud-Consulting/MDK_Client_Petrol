import libCommon from '../../Common/Library/CommonLibrary';
import DocumentCreateDelete from '../../Documents/Create/DocumentCreateDelete';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import NotificationCreateUpdateGeometryPost from './NotificationCreateUpdateGeometryPost';

/**
* Describe this function...
* @param {IClientAPI} context
*/
function CreateEMPEntries(context, EMPObject, actionResults = []) {
    let currKey = Object.keys(EMPObject || {})[0];

    if (currKey) {
        // Get one of the EMPObject Keys and create a Key-Value pair out of all of its data
        let currObject = SplitReadLink(currKey);
        currObject.ConsequenceId = EMPObject[currKey].Consequence || '';
        currObject.LikelihoodId = EMPObject[currKey].Likelihood || '';
        currObject.LeadingConsequence = EMPObject[currKey].LeadingConsequence || false;

        // Remove the key from EMPObject so it is not operated on again
        delete EMPObject[currKey];

        // Run a Create action to make the new WorkRequestConsequence
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/EMP/ConsequenceCreate.action',
            'Properties': {
                'Properties': {
                    'CategoryId': currObject.CategoryId,
                    'ConsequenceId': currObject.ConsequenceId,
                    'GroupId': currObject.GroupId,
                    'LikelihoodId': currObject.LikelihoodId,
                    'PrioritizationProfileId': currObject.PrioritizationProfileId,
                    'LeadingConsequence': currObject.LeadingConsequence ? 'X' : '',
                },
                'CreateLinks':
                [{
                    'Property': 'MyNotificationHeader_Nav',
                    'Target':
                    {
                        'EntitySet': 'MyNotificationHeaders',
                        'ReadLink': context.binding['@odata.readLink'],
                    },
                }],
            },
        }).then((actionResult) => {
            if (Object.keys(EMPObject).length > 0) {
                // Save created entity
                actionResults.push(actionResult);
                // Recursive loop case
                return CreateEMPEntries(context, EMPObject, actionResults);
            } else {
                return Promise.resolve();
            }
        });
    } else {
        // EMPObject is undefined or null
        Promise.resolve();
    }
}
function ClearEMPEntries(context, EMPResults) {
    let currEntry = EMPResults.pop();
    if (currEntry) {
        // Run a Create action to make the new WorkRequestConsequence
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/EMP/ConsequenceDelete.action',
            'Properties': {
                'Target': {
                    'ReadLink': currEntry,
                },
            },
        }).then(() => {
            if (EMPResults.length > 0) {
                // Recursive loop case
                return ClearEMPEntries(context, EMPResults);
            } else {
                // Recursive loop finished
                return Promise.resolve();
            }
        });
    } else {
        return Promise.resolve();
    }
}

export default function NotificationUpdateSuccess(context) {

    let readNotifPartnerDetProcs = context.read('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', [], `$orderby=PartnerFunction&$expand=PartnerFunction_Nav&$top=2&$filter=NotifType eq '${context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue')}' and PartnerIsMandatory eq 'X' and sap.entityexists(PartnerFunction_Nav)`).then(data => {
        let notifPartnerDetProcsArray = [];
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                notifPartnerDetProcsArray.push(data.getItem(i));
            }
        }
        return notifPartnerDetProcsArray;
    });

    let readPartnerFunction = context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Partners`, [], '$orderby=PartnerFunction&$expand=PartnerFunction_Nav').then(data => {
        let partnerFunctionArray = [];
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                partnerFunctionArray.push(data.getItem(i));
            }
        }
        return partnerFunctionArray;
    });

    return Promise.all([readNotifPartnerDetProcs, readPartnerFunction]).then((results) => {
        let intersection = results[1].filter(function(obj) {
            for (var i = 0; i < results[0].length; i++) {
                if (obj.PartnerFunction_Nav.PartnerFunction === results[0][i].PartnerFunction_Nav.PartnerFunction) {
                    return true;
                }
            }
            return false;
        });

        if (intersection.length > 0) {
            let newPartnerNum1 = '';
            let newPartnerNum2 = '';
            var logger = context.getLogger();
            try {
                newPartnerNum1 = context.evaluateTargetPath('#Control:PartnerPicker1/#SelectedValue');
            } catch (error) {
                logger.log(String(error), 'Error');
            }
            try {
                newPartnerNum2 = context.evaluateTargetPath('#Control:PartnerPicker2/#SelectedValue');
            } catch (error) {
                logger.log(String(error), 'Error');
            }

            if (newPartnerNum1 !== context.getClientData().OldPartner1 || newPartnerNum2 !== context.getClientData().OldPartner2) { //only proceed if either of the business partners have changed
                context.getClientData().PartnerFunction = intersection[0].PartnerFunction_Nav.PartnerFunction;
                context.getClientData().PartnerReadLink = intersection[0]['@odata.readLink'];
                context.getClientData().PartnerNum = newPartnerNum1;
                context.getClientData().OldPartnerNum = context.getClientData().OldPartner1;
                return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationPartnerUpdate.action').then((actionResult) => {
                    if (intersection.length > 1) {
                        context.getClientData().PartnerFunction = intersection[1].PartnerFunction_Nav.PartnerFunction;
                        context.getClientData().PartnerReadLink = intersection[1]['@odata.readLink'];
                        context.getClientData().PartnerNum = newPartnerNum2;
                        context.getClientData().OldPartnerNum = context.getClientData().OldPartner2;
                        return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationPartnerUpdate.action');
                    } else {
                        return actionResult;
                    }
                });
            }
        }
        return Promise.resolve();
    }).then(() => {
        // Update Work Request/Notification Consequences
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WorkRequestConsequence_Nav`, [], '').then(data => {
            let consequenceArray = [];
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    consequenceArray.push(data.getItem(i)['@odata.readLink']);
                }
            }

            if (context.getClientData().EMPChanged) {
                // Update Work Request/Notification Consequences
                return ClearEMPEntries(context, consequenceArray).then(() => {
                    return CreateEMPEntries(context, context.getClientData().EMP);
                });
            } else {
                return Promise.resolve();
            }
        }, () => {
            // If WorkRequestConsequence_Nav doesn't exist (no Event Priority Matrix), proceed
            return Promise.resolve();
        });
    }).then(() => {
        if (libCommon.getStateVariable(context, 'GeometryObjectType') === 'Notification') {
            libCommon.setStateVariable(context, 'GeometryObjectType', '');
            return NotificationCreateUpdateGeometryPost(context);
        }
        return Promise.resolve();
    }).then(() => {
        return DocumentCreateDelete(context);
    }).finally(() => {
        context.dismissActivityIndicator();
    });
}
