import libWoMobile from '../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import Logger from '../Log/Logger';


export default function MapWorkOrderStatus(context) {
    try {
        return libWoMobile.headerMobileStatus(context).then(result =>{
            return context.localizeText(result);
        });
    } catch (e) {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMaps.global').getValue(), e);
        return '';
    }
}
