
import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';

export default function FSMFormsInstancesListViewQueryOption(context) {

    if (libForms.isFSMSmartFormsFeatureEnabled(context)) {
        let searchString = context.searchString;
        let filter = '';
        let filters = [];
        let queryBuilder;
        searchString = searchString.toLowerCase();
        if (searchString) {
            //Standard order filters (required when using a dataQueryBuilder)
            filters.push(`substringof('${searchString}', tolower(Description))`);
            filters.push(`substringof('${searchString}', tolower(WorkOrder))`);
            filters.push(`substringof('${searchString}', tolower(Operation))`);
            filters.push(`substringof('${searchString}', tolower(FSMFormTemplate_Nav/Description))`);
            filters.push(`substringof('${searchString}', tolower(FSMFormTemplate_Nav/Name))`);
            filter = '(' + filters.join(' or ') + ')';
        }
        if (libCom.isDefined(context.binding)) {
            queryBuilder = libForms.getOperationFSMFormsQueryOptions(context);
            if (queryBuilder) {
                if (filter) {
                    queryBuilder.filter().and(filter);
                }
                return queryBuilder;
            }
        }
        queryBuilder = libForms.getFSMFormsQueryOptions(context);
        if (filter) {
            queryBuilder.filter(filter);
        }
        return queryBuilder;
    }
    return '';
}
