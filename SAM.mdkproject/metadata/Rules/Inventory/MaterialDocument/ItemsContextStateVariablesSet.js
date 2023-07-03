import newlyCreatedDocsQuery from './NewlyCreatedDocsQuery';
import libCommon from '../../Common/Library/CommonLibrary';
/**
* This function is required to compare values in all items to make
* correct view in several fields on item list page, checks movement,
* sloc and factory of all items of the single document
* @param {IClientAPI} context
* @param {String} docId
* @param {Object} params
*/
export default function ItemsContextStateVariablesSet(context, docId, params) {
    let move = libCommon.getStateVariable(context, 'IMMovementType');
    let query = newlyCreatedDocsQuery(context, docId);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', [], query).then(data => {
        let prevItems = {};
        let prevFlags = {
            factoryFlag: false,
            sLocFlag: false,
            movementFlag: false,
            orderFlag: false,
        };
        if (data && data.length) {
            data.forEach(val => {
                let items = checkForParams(val, prevItems, prevFlags, move);
                prevItems = items.prevItems;
                prevFlags = items.prevFlags;
            });
        }
        if (params) {
            let items = checkForParams(params, prevItems, prevFlags, move);
            prevItems = items.prevItems;
            prevFlags = items.prevFlags;
        }
        if (!prevFlags.movementFlag && prevItems.prevMovement) {
            libCommon.setStateVariable(context, 'CurrentDocsItemsMovementType', prevItems.prevMovement);
        } else {
            libCommon.setStateVariable(context, 'CurrentDocsItemsMovementType', '');
        }
        if (!prevFlags.sLocFlag && prevItems.prevSLoc) {
            libCommon.setStateVariable(context, 'CurrentDocsItemsStorageLocation', prevItems.prevSLoc);
        } else {
            libCommon.setStateVariable(context, 'CurrentDocsItemsStorageLocation', '');
        }
        if (!prevFlags.factoryFlag && prevItems.prevFactory) {
            libCommon.setStateVariable(context, 'CurrentDocsItemsPlant', prevItems.prevFactory);
        } else {
            libCommon.setStateVariable(context, 'CurrentDocsItemsPlant', '');
        }
        if (move === 'I') {
            if (!prevFlags.orderFlag && prevItems.prevOrder) {
                libCommon.setStateVariable(context, 'CurrentDocsItemsOrderNumber', prevItems.prevOrder);
            } else {
                libCommon.setStateVariable(context, 'CurrentDocsItemsOrderNumber', '');
            }
        }
        return true;
    });
}

// compare params of the item to default one (from first item)
function checkForParams(params, prevItems, prevFlags, move) {
    if (!prevFlags.movementFlag) {
        if (!prevItems.prevMovement) {
            prevItems.prevMovement = params.MovementType;
        } else if (prevItems.prevMovement !== params.MovementType) {
            prevFlags.movementFlag = true;
        }
    }
    if (!prevFlags.sLocFlag) {
        if (!prevItems.prevSLoc) {
            prevItems.prevSLoc = params.StorageLocation;
        } else if (prevItems.prevSLoc !== params.StorageLocation) {
            prevFlags.sLocFlag = true;
        }
    }
    if (!prevFlags.factoryFlag) {
        if (!prevItems.prevFactory) {
            prevItems.prevFactory = params.Plant;
        } else if (prevItems.prevFactory !== params.Plant) {
            prevFlags.factoryFlag = true;
        }
    }
    if (move === 'I') {
        if (!prevFlags.orderFlag) {
            if (!prevItems.prevOrder) {
                prevItems.prevOrder = params.OrderNumber;
            } else if (prevItems.prevOrder !== params.OrderNumber) {
                prevFlags.orderFlag = true;
            }
        }
    }
    return { prevFlags, prevItems };
}
