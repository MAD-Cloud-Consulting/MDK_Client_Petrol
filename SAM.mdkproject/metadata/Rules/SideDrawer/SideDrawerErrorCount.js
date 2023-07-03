import count from '../ErrorArchive/SyncErrorsCount';
import errorVal from '../Common/Library/ErrorLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function SideDrawerErrorCount(context) {
    return count(context).then(result => {
        let syncError = errorVal.getErrorMessage(context);
        if (result === '') {
            result = 0;
        } 
        if (!(libVal.evalIsEmpty(syncError))) {
            return context.localizeText('errors_x', [Number(result+1)]);
        }
        return context.localizeText('errors_x', [Number(result)]);
    });
}
