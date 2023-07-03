export default function PartsListQueryOptions(context) {

    let searchString = context.searchString;
    let queryBuilder = context.dataQueryBuilder();

    let filterOpts = [];
    let searchFilterOpts = [];

    if (context.binding.OrderId) {
        filterOpts.push(`OrderId eq '${context.binding.OrderId}'`);
    }

    if (context.binding.OperationNo) {
        filterOpts.push(`OperationNo eq '${context.binding.OperationNo}'`);
    }
    queryBuilder.filter(filterOpts.join(' and '));

    if (searchString !== '') {
        searchFilterOpts.push(`substringof('${searchString}', MaterialNum) eq true`);
        searchFilterOpts.push(`substringof('${searchString.toLowerCase()}', tolower(TextTypeDesc)) eq true`);
        searchFilterOpts.push(`substringof('${searchString.toLowerCase()}', tolower(ComponentDesc)) eq true`);
        let searchTerms = queryBuilder.filterTerm().or(`(${searchFilterOpts.join(' or ')})`, queryBuilder.mdkSearch(searchString));
        queryBuilder.filter().and(searchTerms);
    }

    queryBuilder.orderBy('OperationNo','ItemNumber');
    queryBuilder.expand('Material');
    queryBuilder.expand('MaterialBatch_Nav');
    return queryBuilder;
}
