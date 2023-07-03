export default function ExpensesContextLeadingItems(context) {
    const local = context.binding['@sap.isLocal'];
    let actions = [];

    if (local) {
        actions.push('Edit_Expense');
    }

    return actions;
}
