import InspectionLotConstants from './InspectionLotLibrary';

export default function InspectionLotListViewQueryOption(context) {
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;

    if (searchString) {
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(InspectionLot))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(InspectionLot_Nav/ShortDesc))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(OrderId))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(OperationNo))`);
        filter = '(' + filters.join(' or ') + ')';
    }
    queryBuilder = InspectionLotConstants.getListQueryOptions(context);
    if (filter) {
        queryBuilder.filter(filter);
    }
    return queryBuilder;       
}
