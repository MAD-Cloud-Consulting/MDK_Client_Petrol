import MeasuringPointFDCIsVisible from './MeasuringPointFDCIsVisible';
import EnableWorkOrderEdit from '../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';

export default function MeasuringPointsTakeReadingsIsVisible(clientAPI) {
    
    return MeasuringPointFDCIsVisible(clientAPI).then(isReadingEnabled => {
        if (isReadingEnabled) {
            return EnableWorkOrderEdit(clientAPI).then(isEditEnabled => {
                return isEditEnabled;
            });
        }

        return false;
    });
}
