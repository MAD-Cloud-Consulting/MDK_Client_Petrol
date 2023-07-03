import Logger from '../../Log/Logger';

export default function RefreshPage(clientAPI) {
    try {
        let pageProxy = clientAPI.evaluateTargetPathForAPI('#Page:MaterialDocumentRecentList');
        pageProxy.redraw();   
    } catch (err) {
        /**Implementing our Logger class*/
        Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'Reference to page not found');
        return undefined;
    }
    if (clientAPI._control && clientAPI._control.getContainer() && clientAPI._control.getContainer()._tabPages &&
        clientAPI._control.getContainer()._tabPages.length >= 5) {
        clientAPI._control.getContainer()._tabPages[4].redraw();
    }
}
