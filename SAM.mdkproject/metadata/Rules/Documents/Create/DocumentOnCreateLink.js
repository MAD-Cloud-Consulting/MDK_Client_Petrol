import libCom from '../../Common/Library/CommonLibrary';
import DownloadAndSaveMedia from '../../Documents/DownloadAndSaveMedia';

export default function DocumentOnCreateLink(controlProxy) {
    let key = '';
    let promises = [];
    let id = libCom.getStateVariable(controlProxy, 'LocalId');
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', libCom.getStateVariable(controlProxy, 'parentEntitySet'), [],'$filter='+ libCom.getStateVariable(controlProxy, 'ObjectKey')+" eq '"+ id+ "'").then(result => {
        if (result && result.length > 0) {
            let entity = result.getItem(0);
            let parentReadLink = entity['@odata.readLink'];
            let entitySet = libCom.getStateVariable(controlProxy, 'entitySet');
            let parentEntitySet = libCom.getStateVariable(controlProxy, 'parentEntitySet');
            let parentProperty = libCom.getStateVariable(controlProxy, 'parentProperty');
            const properties = {ObjectKey: id};
            const readLinks = controlProxy.getClientData().mediaReadLinks;
            if (readLinks && parentReadLink) {
                for (let readLink of readLinks) {
                    let links = [];
                    let link = controlProxy.createLinkSpecifierProxy(parentProperty, parentEntitySet, '', parentReadLink);
                    links.push(link);
                    link = controlProxy.createLinkSpecifierProxy('Document', 'Documents', '', readLink);
                    links.push(link);
                    promises.push(controlProxy.create('/SAPAssetManager/Services/AssetManager.service', entitySet, properties, links, {'OfflineOData.RemoveAfterUpload':'true'}));
                }
            }              
            return Promise.all(promises).then(() => {
                DownloadAndSaveMedia(controlProxy);
            }).catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
        } else {
            return key;
        }
    });

}
