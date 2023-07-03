export default function ExpensesContextTrailingItems(context) {
    const local = context.binding['@sap.isLocal'];
    let actions = [];

    if (local) {
        actions.push('Delete_Expense');
    }

    return actions;
}
