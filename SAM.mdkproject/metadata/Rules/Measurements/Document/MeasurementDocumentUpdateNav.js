import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
export default function MeasurementDocumentUpdateNav(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');

    if (libCommon.isCurrentReadLinkLocal(currentReadLink) || context.getClientData().FromErrorArchive) {        
        if (context.getClientData().FromErrorArchive) {
            if (!libVal.evalIsEmpty(context.binding.ErrorObject.RequestBody)) {
                let docNum = JSON.parse(context.binding.ErrorObject.RequestBody).MeasurementDocNum;
                if (!libVal.evalIsEmpty(docNum)) {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeasurementDocuments', [], "$select=Point,MeasurementDocNum,CodeGroup,ReadingDate,ReadingTime,HasReadingValue,ReadingValue,UOM,ValuationCode,CodeShortText,ShortText,ReadBy,MeasuringPoint/PointDesc,MeasuringPoint/CharName,MeasuringPoint/CharDescription,MeasuringPoint/IsCounter,MeasuringPoint/UoM,MeasuringPoint/CodeGroup,MeasuringPoint/CatalogType,MeasuringPoint/CounterOverflow,MeasuringPoint/PrevReadingValue,MeasuringPoint/IsCounter,MeasuringPoint/IsCounterOverflow,MeasuringPoint/IsReverse,MeasuringPoint/IsLowerRange,MeasuringPoint/IsUpperRange,MeasuringPoint/IsCodeSufficient,MeasuringPoint/LowerRange,MeasuringPoint/UpperRange,MeasuringPoint/Decimal&$expand=MeasuringPoint&$filter=MeasurementDocNum eq '" + docNum + "'").then(function(results) {
                        if (results && results.getItem(0)) {
                            const data = results.getItem(0);
                            data.FromErrorArchive = true;
                            context.setActionBinding(data);
                        }
                        libCommon.setStateVariable(context, 'TransactionType', 'UPDATE');
                        return context.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateUpdateNav.action');
                    });
                }
            }
        }
        libCommon.setStateVariable(context, 'TransactionType', 'UPDATE');
        return context.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateUpdateNav.action');
    }
}
