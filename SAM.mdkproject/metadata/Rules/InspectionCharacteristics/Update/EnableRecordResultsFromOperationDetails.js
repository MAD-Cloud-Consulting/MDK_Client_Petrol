import EnableWorkOrderEdit from '../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import EnableRecordResults from './EnableRecordResults';
import IsQMEnabled from '../../ComponentsEnablement/IsQMComponentEnabled';
import IsCheckListEnabled from '../../WorkOrders/InspectionLot/IsCheckListEnabled';

export default function EnableRecordResultsFromOperationDetails(clientAPI) {
    if (IsQMEnabled(clientAPI) || IsCheckListEnabled(clientAPI) ) {
        return EnableWorkOrderEdit(clientAPI).then(isEditEnabled => {
            if (isEditEnabled) {
                return EnableRecordResults(clientAPI);
            } else {
                return false;
            }
        });
    } else {
        return Promise.resolve(false);
    }
    
}
