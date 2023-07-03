/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StatusUpdate(context) {
    if (context.getClientData().isIssue) {
        return 'X';
    } else {
        return '';
    }
}
