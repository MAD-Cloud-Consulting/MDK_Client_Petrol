export default function ChecklistsListViewQueryOptions(context) {
    let searchString = context.searchString;
    let queryBuilder = context.dataQueryBuilder();

    let filter;

    if (context.binding['@odata.type'] === '#sap_mobile.MyEquipment') { 
        filter = `ChecklistBusObjects_Nav/any(cbo : cbo/Equipment_Nav/EquipId eq '${context.binding.EquipId}')`;
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        filter = `ChecklistBusObjects_Nav/any(cbo : cbo/FuncLoc_Nav/FuncLocIdIntern eq '${context.binding.FuncLocIdIntern}')`;
    }

    queryBuilder.orderBy('UpdatedOn desc','ShortDescription asc').expand('ChecklistBusObjects_Nav').filter(filter);
    queryBuilder.filter().and(queryBuilder.filterTerm(`substringof('${searchString.toLowerCase()}', tolower(ShortDescription))`));

    return queryBuilder;
}
