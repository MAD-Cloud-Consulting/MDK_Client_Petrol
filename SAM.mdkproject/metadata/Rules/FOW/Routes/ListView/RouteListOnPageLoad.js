import Logger from '../../../Log/Logger';

export default function RouteListOnPageLoad(pageClientAPI) {
    Logger.info(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'RouteListOnPageLoad called');
}
