import Logger from '../Log/Logger';
import lamFilter from './LAMFilter';

export default function LAMNav(context) {
    let pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();
    let filter = lamFilter(context);

    //Rebind the LAM data
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionContext['@odata.readLink'] + '/LAMObjectDatum_Nav', [], filter).then(LAM => {
        pageProxy.setActionBinding(LAM.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/LAM/LAMDetailsNav.action');
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryLAM.global').getValue(), error);
    });
}
