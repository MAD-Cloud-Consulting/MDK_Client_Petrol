export default function NotificationItemsListViewQueryOption(clientAPI) {
    let queryBuilder = clientAPI.dataQueryBuilder();

    queryBuilder.expand('Notification,Notification/NotifMobileStatus_Nav,Notification/NotifMobileStatus_Nav/OverallStatusCfg_Nav');
    queryBuilder.orderBy('ItemSortNumber asc');

    if (clientAPI.searchString) {
        let searchFilters = [
            `substringof('${clientAPI.searchString.toLowerCase()}', tolower(ItemNumber))`,
            `substringof('${clientAPI.searchString.toLowerCase()}', tolower(ItemText))`,
            `substringof('${clientAPI.searchString.toLowerCase()}', tolower(ObjectPart))`,
            `substringof('${clientAPI.searchString.toLowerCase()}', tolower(ObjectPartCodeGroup))`,
            `substringof('${clientAPI.searchString.toLowerCase()}', tolower(DamageCode))`,
            `substringof('${clientAPI.searchString.toLowerCase()}', tolower(CodeGroup))`,
        ];
        queryBuilder.filter(searchFilters.join(' or '));
    }
    return queryBuilder;
}
