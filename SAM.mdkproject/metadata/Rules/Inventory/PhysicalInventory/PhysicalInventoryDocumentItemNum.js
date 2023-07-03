import GenerateLocalID from '../../Common/GenerateLocalID';
import libCom from '../../Common/Library/CommonLibrary';
import getDocId from './PhysicalInventoryDocumentID';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PhysicalInventoryDocumentItemNum(context, extraOffset=0) {
    let query = "$filter=PhysInvDoc eq '" + getDocId(context) + "'";
    return GenerateLocalID(context, 'PhysicalInventoryDocItems', 'Item', '000', query, '', '', extraOffset).then((result) => {
        libCom.setStateVariable(context, 'PhysicalInventoryItemId', result);
        return result;
    });
}
