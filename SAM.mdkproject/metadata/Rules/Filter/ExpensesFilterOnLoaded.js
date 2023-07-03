export default function ExpensesFilterOnLoaded(context) {
    let sortFilter = context.getControl('FormCellContainer').getControl('SortFilter');
    let sortFilterActiveItems = sortFilter.getValue().filterItems;
    if (sortFilterActiveItems.length === 0) { 
        sortFilter.setValue('StartTimeStamp'); //Set default Sort By filter value
    }
}
