import autoOpenMovementScreen from '../Search/AutoOpenMovementScreen';

/**
 * Common rule to build queries for PRD components
 * @param {*} context PRD objects
 * @returns DataQueryBuilder
 */
export default function GetComponentsListQuery(context) {
    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('ItemNum');

    let searchString = context.searchString;
    if (searchString) {
        searchString = context.searchString.toLowerCase();
    }

    // leaving this for perspective
    // let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    // if (type === 'ProductionOrderHeader') {}
    return getPRDComponentsQuery(context, queryBuilder, searchString);
}

function getPRDComponentsQuery(context, queryBuilder, searchString) {
    queryBuilder.filter("(OrderId eq '" + context.binding.OrderId + "')");
    queryBuilder.expand('MaterialPlant_Nav/Material', 'MaterialPlant_Nav', 'MaterialDocItem_Nav');
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(OrderId))`,
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(Batch))`,
            `substringof('${searchString}', tolower(StorageBin))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(MaterialPlant_Nav/Material/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'ProductionOrderComponents', queryBuilder, searchString);
}
