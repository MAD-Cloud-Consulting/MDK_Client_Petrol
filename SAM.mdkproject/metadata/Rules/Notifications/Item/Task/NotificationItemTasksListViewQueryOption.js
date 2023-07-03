export default function NotificationItemTasksListViewQueryOption(context) {
    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('ItemTaskMobileStatus_Nav,Item/Notification/NotifMobileStatus_Nav').orderBy('TaskSortNumber');
        let filters = [
            `substringof('${searchString.toLowerCase()}', tolower(TaskSortNumber))`,
            `substringof('${searchString.toLowerCase()}', tolower(TaskText))`,
            `substringof('${searchString.toLowerCase()}', tolower(TaskCodeGroup))`,
            `substringof('${searchString.toLowerCase()}', tolower(TaskCode))`,
        ];
        qob.filter(filters.join(' or '));
        return qob;
    } else {
        return '$expand=ItemTaskMobileStatus_Nav,Item/Notification/NotifMobileStatus_Nav&$orderby=TaskSortNumber asc';
    }
}
