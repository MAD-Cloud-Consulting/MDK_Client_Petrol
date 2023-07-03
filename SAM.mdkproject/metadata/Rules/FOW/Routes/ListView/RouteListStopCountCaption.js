import libForm from '../../Common/Library/FormatLibrary';
import FSMMapQueryOptions from '../../../Maps/FSMMapQueryOptions';
import ODataDate from '../../../Common/Date/ODataDate';

export default function RouteListStopCountCaption(context) {
    let binding = context.binding;
    let count = (binding.Stops === undefined) ? 0 : binding.Stops.length;
    
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        const date = new ODataDate(new Date(binding.ScheduledStartDate));
        let dateFilter = `ScheduledStartDate eq ${date.queryString(context, 'date')}`;
        return FSMMapQueryOptions(context, dateFilter).then(queryOptions => {
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', queryOptions).then(woCount => {
                return libForm.formatRouteListStopCount(context, woCount);
            });
        });
    }

    return libForm.formatRouteListStopCount(context, count);
}
