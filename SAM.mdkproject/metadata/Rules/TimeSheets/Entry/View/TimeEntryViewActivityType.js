
export default function TimeEntryViewActivityType(context) {
    let activityType = '';

    if (context.constructor.name === 'SectionedTableProxy') {
        activityType = context.binding.ActivityType;
    } else {
        activityType = context.getPageProxy().binding.ActivityType;
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'COActivityTypes', [], `$filter=ActivityType eq '${activityType}'`).then(result => {
        if (!result || result.length === 0) {
            return '-';
        }
        return result.getItem(0).ActivityTypeDescription;
    });
}
