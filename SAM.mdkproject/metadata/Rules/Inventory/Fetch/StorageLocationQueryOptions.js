import SetDefaultPlant from './SetDefaultPlant';

export default function StorageLocationQueryOptions(context) {
    const selection = SetDefaultPlant(context);

    if (selection) {
        return `$orderby=StorageLocation&$filter=Plant eq '${selection}'`;
    }
    return '$orderby=StorageLocation';
}
