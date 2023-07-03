import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnDemandObjectOnDocumentSelectedOrUnSelectedType(context) {

    if (!libVal.evalIsEmpty(context.getPageProxy().getControls()) && context.getPageProxy().getControls().length > 0 && !libVal.evalIsEmpty(context.getPageProxy().getControls()[0].getSections()) && context.getPageProxy().getControls()[0].getSections().length > 0) {
        let item = context.getPageProxy().getControls()[0].getSections()[0].getSelectionChangedItem();
        let documents = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Documents;
        if (libVal.evalIsEmpty(documents)) {
            documents = [];
        }

        if (item.selected) {
            let document = Object();
            document.ObjectId = item.binding.ObjectId || '';
            document.OrderId = item.binding.OrderId || '';
            document.IMObject = item.binding.IMObject;
            documents.push(document);
            context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Documents = documents;
        } else {
            let newDocuments = [];
            if (documents.length > 0) {
                for (var i = 0; i < documents.length; i++) {
                    if (!(documents[i].ObjectId === item.binding.ObjectId && documents[i].OrderId === item.binding.OrderId)) {
                        let document = Object();
                        document.ObjectId = documents[i].ObjectId;
                        document.OrderId = documents[i].OrderId;
                        document.IMObject = documents[i].IMObject;
                        newDocuments.push(document);
                    }
                }
            }
            context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Documents = newDocuments;
        }
    }
    return true;
}
