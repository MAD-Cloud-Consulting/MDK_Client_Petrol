import count from './SyncErrorsCount';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function ErrorArchiveCount(context) {
    return count(context).then(result => {
        if (result === '') {
            result = 0;
        } 
        return context.localizeText('transactional_errors_x',[result]);
    });
}
