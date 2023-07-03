export default function NotificationItemCausesListViewQueryOption(context) {
    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('Item/Notification').orderBy('CauseSortNumber');
        let filters = [
            `substringof('${searchString.toLowerCase()}', tolower(CauseSortNumber))`,
            `substringof('${searchString.toLowerCase()}', tolower(CauseText))`,
            `substringof('${searchString.toLowerCase()}', tolower(CauseCodeGroup))`,
            `substringof('${searchString.toLowerCase()}', tolower(CauseCode))`,
        ];
        qob.filter(filters.join(' or '));
        return qob;
    } else {
        return '$expand=Item/Notification&$orderby=CauseSortNumber asc';
    }
}
