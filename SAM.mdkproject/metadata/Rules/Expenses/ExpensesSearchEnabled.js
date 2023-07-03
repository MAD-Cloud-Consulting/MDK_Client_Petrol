import ExpensesCount from './ExpensesCount';

export default function ExpensesSearchEnabled(context) {
    return ExpensesCount(context).then(count => !!count);
}
