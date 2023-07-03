export default function GeometryDelete(context, navLink, entitySet) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/${navLink}`, [], '').then(geometries => {
        let deleteActions = [];
        for (let i = 0; i < geometries.length; i++) {
            let geometry = geometries.getItem(i);
            deleteActions.push(context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryDelete.action', 'Properties': {
                'Target': {
                    'EntitySet' : entitySet,
                    'Service' : '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink' : geometry['@odata.readLink'],
                },
            }}));
        }
        return Promise.all(deleteActions);
    });
}
