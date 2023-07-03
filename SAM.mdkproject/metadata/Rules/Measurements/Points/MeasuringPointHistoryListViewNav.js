import libVal from '../../Common/Library/ValidationLibrary';
export default function MeasuringPointHistoryListViewNav(clientAPI) {
    if (!libVal.evalIsEmpty(clientAPI.binding.CodeGroup)) {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointHistoryListViewWithValCodeNav.action');
    } else {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointHistoryListViewNav.action');
    }
}
