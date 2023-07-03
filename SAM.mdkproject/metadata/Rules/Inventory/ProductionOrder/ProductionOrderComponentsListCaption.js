import ComLib from '../../Common/Library/CommonLibrary';

export default function ProductionOrderComponentsListCaption(clientAPI) {
    const queryOptions = "$filter=(OrderId eq '" + clientAPI.getPageProxy().binding.OrderId + "')";
    return ComLib.getEntitySetCount(clientAPI, 'ProductionOrderComponents', queryOptions).then(totalCount => {
        const count = clientAPI.evaluateTargetPath('#Count');
        if (totalCount && totalCount !== count) {
            return clientAPI.localizeText('components') + ' (' + count + '/' + totalCount + ')';
        }
        return clientAPI.localizeText('components') + ' (' + count + ')';
    });
}
