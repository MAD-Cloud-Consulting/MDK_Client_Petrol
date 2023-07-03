export default function MeasuringPointsListViewEntitySet(pageClientAPI) {
    let readLink = pageClientAPI.evaluateTargetPathForAPI('#Page:-Previous').getReadLink();
    if (readLink && readLink.indexOf('MyWorkOrderOperations') !== -1) {
        return pageClientAPI.binding['@odata.readLink'] + '/Tools';
    }
    return pageClientAPI.binding['@odata.readLink'] + '/MeasuringPoints';
}
