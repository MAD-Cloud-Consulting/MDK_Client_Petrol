import Logger from '../Log/Logger';
import style from '../Common/Style/StyleFormCellButton';
import isAndroid from '../Common/IsAndroid';

export default function FilterOnLoaded(pageClientAPI) {
    try {
        if (!isAndroid) {
            style(pageClientAPI, 'ResetButton', 'FormCellButton');
        }

        let prevPage = pageClientAPI.evaluateTargetPathForAPI('#Page:-Previous');
        if (prevPage.actionResults && prevPage.actionResults.filterResult.data && prevPage.actionResults.filterResult.data.filter.includes('islocal')) {
            var control = pageClientAPI.evaluateTargetPath('#Page:FunctionalLocationFilterPage/#Control:LocalFilter');
            control.setValue('true');
        }
    } catch (exception) {
        /**Implementing our Logger class*/
        Logger.error('Filter', `FilterReset error: ${exception}`);
    }
}
