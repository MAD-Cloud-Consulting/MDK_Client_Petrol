import ExpensesCount from './ExpensesCount';

export default function OnExpensesListReturning(context) {
    let pageProxy = context.evaluateTargetPathForAPI('#Page:ExpensesListViewPage');
    let table = pageProxy.getControl('SectionedTable');
    if (table) {
        table.redraw();
    }
    ExpensesCount(context).then(count => context.setCaption(context.localizeText('expenses', [count])));
}
