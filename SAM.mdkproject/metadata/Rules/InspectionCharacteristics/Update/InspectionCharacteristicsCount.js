import InspectionCharacteristicsUpdateQueryOptions from './InspectionCharacteristicsUpdateQueryOptions';
import InspectionCharacteristicsUpdateEntitySet from './InspectionCharacteristicsUpdateEntitySet';
import FetchRequest from '../../Common/Query/FetchRequest';

export default function InspectionCharacteristicsCountTitle(context) {
    const entitySet = InspectionCharacteristicsUpdateEntitySet(context);
    const queryString = InspectionCharacteristicsUpdateQueryOptions(context);
    const request = new FetchRequest(entitySet, queryString);

    return request.count(context).then(countResult => {
        return context.localizeText('record_results_x', [countResult]);
    });
}
