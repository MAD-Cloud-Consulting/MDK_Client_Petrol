import libCom from '../../../Common/Library/CommonLibrary';

export default function IsDiscardButtonVisibleForPIItem(context) {
    if (libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {  //Was this line item created locally on client?
         //Only local PI items can be discarded
        let query = "$filter=PhysInvDoc eq '" + context.binding.PhysInvDoc + "' and FiscalYear eq '" + context.binding.FiscalYear + "'";
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'PhysicalInventoryDocItems', query).then(function(count) { 
            if (count > 1) { //Can only delete if not the last item
                return true;
            }
            return false;
        });        
    }
    return false;
}
