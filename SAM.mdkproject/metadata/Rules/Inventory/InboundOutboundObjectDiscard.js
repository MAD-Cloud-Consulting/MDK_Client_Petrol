import libVal from '../Common/Library/ValidationLibrary';
import logger from '../Log/Logger';
import CommonLibrary from '../Common/Library/CommonLibrary';
import refreshAllTabsOverviewPage from './Overview/RefreshAllTabsOverviewPage';

export default function InboundOutboundObjectDiscard(context) {
    showWarningMessage(context)
        .then((discard) => {
            if (discard) {
                context.evaluateTargetPathForAPI('#Page:InboundOutboundListPage').getControls()[0].getSections()[0].setSelectionMode('None');
                objectDiscard(context);
            }
        });
}

function resetStartState(context) {
    context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().DiscardDocuments = [];
    CommonLibrary.enableToolBar(context, 'InboundOutboundListPage', 'DiscardButton', false);
}

function showWarningMessage(context) {
    context.dismissActivityIndicator();
    return context.executeAction('/SAPAssetManager/Actions/Inventory/InboundOutbound/Discard.action').then(result => {
        return result.data;
    });
}

function objectDiscard(context, index) {
    let documents = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().DiscardDocuments;
    if (libVal.evalIsEmpty(index)) {
        index = 0;
    }

    if (documents && documents.length > 0 && documents.length > index) {
        let id = documents[index].ObjectId;
        if (!id) { // only for PRD ObjectId field is empty
            id = documents[index].OrderId;
        }
        return OnDemandObjectDelete(context, id, documents[index].IMObject).then(() => {
                index = index + 1;
                return objectDiscard(context, index);
            }).catch((error) => {
                logger.error('DiscardDocuments', error);
                index = index + 1;
                return objectDiscard(context, index);
            });
    }
    resetStartState(context);
    refreshAllTabsOverviewPage(context, true);
    return true;

}

function OnDemandObjectDelete(context, objectID, objectType) {
    const action = 'D';
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], "$filter=ObjectId eq '" + objectID + "' and ObjectType eq '" + objectType + "' and Action eq '" + action + "'").then(function(results) {
        if (results && results.length > 0) {
            let row = results.getItem(0);
            if (row['@sap.isLocal']) {
                return true; //Nothing to do, record is already in the transaction queue
            }
            let readLink = row['@odata.readLink'];
            //Row exists, but is not in transaction queue, so update it
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/CreateUpdateDelete/OnDemandObjectUpdateGeneric.action', 'Properties': {
                'Properties': {
                    'ObjectId': objectID,
                    'ObjectType': objectType,
                    'Action': action,
                },
                'Target': {
                    'ReadLink' : readLink,
                },                
            }});
        }
        //Row does not exist, so create one
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/CreateUpdateDelete/OnDemandObjectCreateGeneric.action', 'Properties': {
            'Properties': {
                'ObjectId': objectID,
                'ObjectType': objectType,
                'Action': action,
            },          
        }});
    });
}
