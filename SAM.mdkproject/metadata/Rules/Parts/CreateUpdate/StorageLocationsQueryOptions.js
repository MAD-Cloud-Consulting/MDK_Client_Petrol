export default function StorageLocationQueryOptions(context) {
    let queryOptions = '$orderby=StorageLocation';
    if (context.binding && context.binding.Plant) {
        queryOptions = `$orderby=StorageLocation&$filter=Plant eq '${context.binding.Plant}'`;
    }
    return queryOptions;
}
