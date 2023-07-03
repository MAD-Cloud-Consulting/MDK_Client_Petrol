import libCommon from '../../Common/Library/CommonLibrary';
import InspectionLotListViewEntitySet from './InspectionLotListViewEntitySet';

export default function InspectionLotListViewCaption(context) {
    let queryOption = libCommon.getStateVariable(context,'INSPECTION_LOT_FILTER');
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', InspectionLotListViewEntitySet(context), '');
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', InspectionLotListViewEntitySet(context), queryOption);
    var params = [];

    return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
        let totalCount = resultsArray[0];
        let count = resultsArray[1];
        params.push(count);
        params.push(totalCount);
        if (queryOption === '' || count === totalCount) {
            return context.setCaption(context.localizeText('checklists_x', [totalCount]));
        }
        return context.setCaption(context.localizeText('checklists_x_x', params));
    });
}

