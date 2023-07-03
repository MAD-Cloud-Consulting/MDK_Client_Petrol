import showMaterialTransferToFields from './ShowMaterialTransferToFields';
import showBatch from './ShowMaterialBatchField';

export default function ShowTransferToBatchField(context) {
    return showBatch(context).then(function(show) {
        if (showMaterialTransferToFields(context) && show) {
            return true;
        }
        return false;
    });
}
