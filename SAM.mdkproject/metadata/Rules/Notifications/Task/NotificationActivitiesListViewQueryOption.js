export default function NotificationActivitiesListViewQueryOption(context) {
    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('Notification').orderBy('ActivitySortNumber');
        let filters = [
            `substringof('${searchString.toLowerCase()}', tolower(ActivitySortNumber))`,
            `substringof('${searchString.toLowerCase()}', tolower(ActivityText))`,
            `substringof('${searchString.toLowerCase()}', tolower(ActivityCodeGroup))`,
            `substringof('${searchString.toLowerCase()}', tolower(ActivityCode))`,
        ];
        qob.filter(filters.join(' or '));
        return qob;
    } else {
        return '$expand=Notification&$orderby=ActivitySortNumber asc';
    }
}
