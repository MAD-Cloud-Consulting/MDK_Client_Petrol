import localMediaSave from './Save/DocumentFileSaveLocal';
export default function DownloadAndSaveMedia(pageProxy) {
    var promises = [];
    pageProxy.getClientData().readLinkCounter = 0;
    let mediaReadLinks = pageProxy.getClientData().mediaReadLinks;
    for (let i = 0; i<mediaReadLinks.length; i++) {
        promises.push(pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadAndSaveMedia.action'));
    }
    return Promise.all(promises).then(() => {
        return localMediaSave(pageProxy).then(() => true);
    });
}
