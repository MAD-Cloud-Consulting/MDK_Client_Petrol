export default function NotificationTasksListViewQueryOption(context) {
    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('Notification/NotifMobileStatus_Nav,TaskMobileStatus_Nav').orderBy('TaskSortNumber');
        let filters = [
            `substringof('${searchString.toLowerCase()}', tolower(TaskSortNumber))`,
            `substringof('${searchString.toLowerCase()}', tolower(TaskText))`,
            `substringof('${searchString.toLowerCase()}', tolower(TaskCodeGroup))`,
        ];
        qob.filter(filters.join(' or '));
        return qob;
    } else {
        return '$expand=Notification/NotifMobileStatus_Nav,TaskMobileStatus_Nav&$orderby=TaskSortNumber asc';
    }
}
