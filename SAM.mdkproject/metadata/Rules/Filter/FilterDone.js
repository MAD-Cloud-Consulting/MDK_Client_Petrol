import filterLib from './FilterLibrary';
import Logger from '../Log/Logger';

export default function FilterDone(pageClientAPI) {
    try {
        var count = filterLib.getFilterCount(pageClientAPI);
        var previousPage = pageClientAPI.evaluateTargetPathForAPI('#Page:-Previous');
        if (count > 0 && !filterLib.isDefaultFilter(pageClientAPI)) {
            previousPage.getPressedItem().getActionItem().text = pageClientAPI.localizeText('filter_count',[count]);
        } else {
            previousPage.getPressedItem().getActionItem().text = pageClientAPI.localizeText('filter');
        }
    } catch (exception) {
        /**Implementing our Logger class*/
        Logger.error('Filter', `FilterUpdateCount error: ${exception}`);
    }
    return pageClientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
