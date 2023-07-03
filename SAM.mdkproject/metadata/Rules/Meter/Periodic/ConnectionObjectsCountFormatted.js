export default function ConnectionObjectsCountFormatted(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/StreetRoute_Nav', [], '$expand=ConnectionObject_Nav').then(function(result) {
        if (result && result.length > 0) {
            let cherryPick = {};

            for (let i = 0; i < result.length; i ++) {
                cherryPick[result.getItem(i).ConnectionObject] = true;
            }

            return context.localizeText('connection_objects_x', String(Object.keys(cherryPick).length));
        } else {
            return context.localizeText('connection_objects_x', '0');
        }
    });
}
