import Logger from '../../Log/Logger';
import libVal from '../../Common/Library/ValidationLibrary';

export default function MeasuringPointDetailsNav(context) {
    let readLink = context.binding['@odata.readLink'];
    let pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();
    let query = '$expand=MeasurementDocs,WorkOrderTool&$select=*,Point,PointDesc,CharName,UoM,IsCounter,CodeGroup,CatalogType,MeasurementDocs/ReadingDate,MeasurementDocs/ReadingTime,MeasurementDocs/ReadingValue,MeasurementDocs/IsCounterReading,MeasurementDocs/CounterReadingDifference,MeasurementDocs/MeasurementDocNum,MeasurementDocs/CodeGroup';
    if (readLink && readLink.indexOf('MyWorkOrderOperations') !== -1) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', actionContext['@odata.readLink'] + '/PRTPoint', [], query).then(Result => {
            pageProxy.setActionBinding(Result.getItem(0));
            /**Navagation to a different detail pages if val code only*/
            if (!libVal.evalIsEmpty(Result.getItem(0).CodeGroup)) {
                if (libVal.evalIsEmpty(Result.getItem(0).CharName)) {
                    return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsValCodeNav.action');
                } else {
                    return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsNav.action');
                }
            } else {
                return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsNav.action');
            }
        }, error => {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasuringPoints.global').getValue(), error);
        });
    } 
    //Rebind the necessary point record data selected from the list
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionContext['@odata.readLink'], [], query).then(Result => {
        pageProxy.setActionBinding(Result.getItem(0));
         /**Navagation to a different detail pages if val code only*/
        if (!libVal.evalIsEmpty(Result.getItem(0).CodeGroup)) {
            if (libVal.evalIsEmpty(Result.getItem(0).CharName)) {
                return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsValCodeNav.action');
            } else {
                return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsNav.action');
            }
        } else {
            return pageProxy.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsNav.action');
        }
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasuringPoints.global').getValue(), error);
    });
}
