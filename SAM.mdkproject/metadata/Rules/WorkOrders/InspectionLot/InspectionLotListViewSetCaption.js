import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import InspectionLotListViewEntitySet from './InspectionLotListViewEntitySet';

export default function InspectionLotListViewSetCaption(context) {
    var entitySet;
    var queryOption;
    var localizeText;
    var localizeText_x_x;
    let parameters = CommonLibrary.getStateVariable(context,'INSPECTION_LOT_FILTER');

    context.getControl('SectionedTable').redraw();

    if (!libVal.evalIsEmpty(parameters)) {
        entitySet = parameters.entity;
        queryOption = parameters.query;
        localizeText = parameters.localizeTextX;
        localizeText_x_x = parameters.localizeTextXX;
    } else {
        if (CommonLibrary.isDefined(context.binding['@odata.type'])) {
            entitySet = InspectionLotListViewEntitySet(context);
            queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
            localizeText = 'checklists_x';
            localizeText_x_x = 'checklists_x_x';
        }
    }

    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet, '');
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
        let totalCount = resultsArray[0];
        let count = resultsArray[1];
        let caption;
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            caption = context.localizeText(localizeText, [totalCount]);
        } else {
            caption = context.localizeText(localizeText_x_x, params);
        }
        context.getClientData().PageCaption = caption;
        return context.setCaption(caption);
    });
}
