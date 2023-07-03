import count from '../SubOperations/SubOperationCount';

export default function SideDrawerSubOperationsCount(context) {
    return count(context).then(result => {
        return context.localizeText('suboperations_x', [result]);
    });
}
