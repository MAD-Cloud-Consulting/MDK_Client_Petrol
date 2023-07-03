import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';

export default function SerialNumbersSortedQuery(context) {
    const serialNumbers = [];
    if (context.binding) {
        const entitySet = context.binding['@odata.readLink'] + '/Material/SerialNumbers';
        const readLink = SplitReadLink(context.binding['@odata.readLink']);
        const query = `$filter=Plant eq '${readLink.Plant}' and StorageLocation eq '${readLink.StorageLocation}'`; 

        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], query).then(data => {
            for (let i = 0; i < data.length; i++) {
                serialNumbers.push(data.getItem(i));
            }

            serialNumbers.sort((a, b) => a.SerialNumber - b.SerialNumber);
            return serialNumbers;
        });
    }
    return serialNumbers;
}
