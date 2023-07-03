
export default function PriorityListPicker(context) {

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Priorities', [], '$orderby=PriorityDescription').then(results => {
        if (results._array.length > 0) {
            let filterArr = results._array.filter((el, index) =>
                index === results._array.findIndex(other => el.PriorityDescription === other.PriorityDescription)
            );
            let returnArr = filterArr.map(i => ({ 'ReturnValue': i.Priority, 'DisplayValue': i.PriorityDescription }));
            return returnArr;
        } return [];
    });
}
