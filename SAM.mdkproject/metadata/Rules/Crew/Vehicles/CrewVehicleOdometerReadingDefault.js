import point from './CrewVehicleOdometerPoint';
import libCom from '../../Common/Library/CommonLibrary';

export default function CrewVehicleOdometerReadingDefault(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${point(context)}')/MeasurementDocs`, [], '$select=ReadingValue&$top=1&$orderby=ReadingTimestamp desc').then(function(result) {
        if (result && result.length > 0) {
            let readLink = result.getItem(0)['@odata.readLink'];
            if (libCom.isCurrentReadLinkLocal(readLink)) {
                let readingValue = result.getItem(0).ReadingValue;
                if (libCom.isDefined(readingValue)) {
                    let decimal = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/MeasuringPoints/FormatDecimalPrecision.global').getValue());
                    return context.formatNumber(readingValue, '', {maximumFractionDigits: decimal});
                }
                return 0;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    });
}
