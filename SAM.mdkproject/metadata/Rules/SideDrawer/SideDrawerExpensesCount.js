import ExpensesCount from '../Expenses/ExpensesCount';

export default function SideDrawerExpensesCount(context) {
    return ExpensesCount(context).then(count => context.localizeText('expenses', [count]));
}
