import FDCQueryOptions from './MeasuringPointFDCQueryOptions';
import FDCEntitySet from './MeasuringPointFDCEntitySet';
import libCommon from '../../Common/Library/CommonLibrary';
import enableMeasurementCreate from '../../UserAuthorizations/Measurements/EnableMeasurementCreate';

export default function MeasuringPointFDCIsVisible(context) {

    if (enableMeasurementCreate(context)) {
        //Determie the query options
        return FDCQueryOptions(context).then(function(result) {
            ///If query options are defined do count else hide take readings option on pop-over
            if (libCommon.isDefined(result)) {
                return context.count('/SAPAssetManager/Services/AssetManager.service', FDCEntitySet(context), result).then(function(counts) {
                    ///If there are no measuring point hide take readings option on pop-over
                    if (counts > 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
            } else {
                return false;
            }
        });
    }
    return Promise.resolve(false);

}
