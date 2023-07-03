import ExpensesCount from './ExpensesCount';

export default function ExpensesListViewCaption(context) {
    return ExpensesCount(context).then(count => context.setCaption(context.localizeText('expenses', [count])));
}
