import libVal from '../Common/Library/ValidationLibrary';

export default function FetchActivityType(context, controlArea, activityTypeId) {

    if (libVal.evalIsEmpty(controlArea) || libVal.evalIsEmpty(activityTypeId)) {
        return Promise.resolve(undefined);
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'COActivityTypes', [], `$filter=ActivityType eq '${activityTypeId}' and ControllingArea eq '${controlArea}'&$top=1`).then(result => {
        if (result.length === 0) {
            return undefined;
        }
        return result.getItem(0);
    });

}
