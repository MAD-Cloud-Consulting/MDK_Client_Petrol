import libCommon from '../Common/Library/CommonLibrary';
export default function MeasurementDetailsOnPageLoad(pageClientAPI) {
    let currentReadLink = libCommon.getTargetPathValue(pageClientAPI, '#Property:@odata.readLink');
    if (!libCommon.isCurrentReadLinkLocal(currentReadLink)) {
        // Hide Edit button since only local readings can be edited
        pageClientAPI.setActionBarItemVisible(0, false);
    }
}

