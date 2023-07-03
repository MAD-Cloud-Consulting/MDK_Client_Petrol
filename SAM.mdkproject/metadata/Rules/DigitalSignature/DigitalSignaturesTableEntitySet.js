export default function DigitalSignatureTableEntity(context) {
    let entity = context.binding['@odata.readLink']+'/DigitalSignLink_Nav';
    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], '$expand=DigitalSignatureHeader_Nav')
    .then(results => {
        if (results.getItem(0)) {
            return results.getItem(0).DigitalSignatureHeader_Nav['@odata.readLink']+'/DigitalSignatureItem_Nav';
        } else {
            return entity;
        }
 }).catch(() => {
    return entity;
 });
 }
