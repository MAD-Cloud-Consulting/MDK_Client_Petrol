import ExpensesQueryOption from './ExpensesQueryOptions';

export default function ExpensesCount(context) {
    const query = ExpensesQueryOption(context);
    
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'Confirmations', query).then(count => {
        return count;
    });
}
