import writeDocument from '../Save/DocumentSave';
export default function DocumentFileSaveLocal(pageProxy) {
    let mediaReadLinks = pageProxy.getClientData().mediaReadLinks;
    let medias = [];
    for (let i = 0; i<mediaReadLinks.length; i++) {
        medias.push(pageProxy.read('/SAPAssetManager/Services/AssetManager.service', pageProxy.getClientData().mediaReadLinks[i], [], ''));
    }
    return Promise.all(medias).then(function(observableArray) {
        for (let i = 0; i<observableArray.length; i++) {
            let document = observableArray[i];
            let documentObject = document.getItem(0); 
            writeDocument(pageProxy, documentObject);
        }
    });
}

