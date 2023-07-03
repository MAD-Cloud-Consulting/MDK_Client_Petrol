/**
* Show/Hide take Reading button based on User Authorization and measuring points
* @param {IClientAPI} context
*/
import MeasuringPointsCount from '../Measurements/Points/MeasuringPointsCount';
import enableMeasurementCreate from '../UserAuthorizations/Measurements/EnableMeasurementCreate';
export default function EquipmentTakeReadingIsVisible(context) {
    context.getPageProxy = () => context;
    return MeasuringPointsCount(context).then(e => {
        return e > 0 ? enableMeasurementCreate(context) : false;
    });
}

