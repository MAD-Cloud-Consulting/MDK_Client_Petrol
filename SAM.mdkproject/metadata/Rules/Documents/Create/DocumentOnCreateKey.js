import libCom from '../../Common/Library/CommonLibrary';
export default function DocumentOnCreateKey(controlProxy) {
    let key = '';
    let id = libCom.getStateVariable(controlProxy, 'LocalId');
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', libCom.getStateVariable(controlProxy, 'parentEntitySet'), [],'$filter='+libCom.getStateVariable(controlProxy, 'ObjectKey')+" eq '"+ id+ "'").then(result => {
        if (result && result.length > 0) {
            let entity = result.getItem(0);
            return '<' + entity['@odata.readLink'] +':'+ libCom.getStateVariable(controlProxy, 'ObjectKey')+'>'; 
        } else {
            return key;
        }
    });
}
