import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import SetCaption from './InspectionLotListViewSetCaption';
import InspectionLotConstants from './InspectionLotLibrary';

export default function InspectionLotListViewFilter(context) {
    var queryOption = getQuery(context);
    let entitySet = context.binding ? context.binding['@odata.readLink'] + '/EAMChecklist_Nav' : 'EAMChecklistLinks';
    let localizeText = 'checklists_x';
    let localizeText_x_x = 'checklists_x_x';
    let filterText = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
    let customFilter = libCom.getStateVariable(context, 'CustomListFilter');

    if (customFilter) {
        if (filterText !== '$filter=') { //Combine mdk filter with custom filter
            queryOption = queryOption.replace('&$filter=' + customFilter,''); //Remove current custom filter        
            queryOption += '&' + filterText + ' and ' + customFilter; //Inject mdk filter combined with custom filter
        }
    } else {
        if (filterText !== '$filter=') {
            queryOption += '&' + filterText; //Inject mdk filter only
        }
    }
    libCom.setStateVariable(context,'INSPECTION_LOT_FILTER', {entity: entitySet, query: queryOption, localizeTextX: localizeText, localizeTextXX: localizeText_x_x});
    return SetCaption(context);
}

function getQuery(context) {
    return InspectionLotConstants.getListQueryOptions(context, false);
}
