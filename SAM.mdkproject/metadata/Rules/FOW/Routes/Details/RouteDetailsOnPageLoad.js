import Logger from '../../../Log/Logger';

export default function RouteDetailsOnPageLoad(pageClientAPI) {
    Logger.info(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'RouteDetailsOnPageLoad called');
}
