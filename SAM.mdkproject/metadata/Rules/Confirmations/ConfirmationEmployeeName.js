
export default function ConfirmationEmployeeName(context) {

    let employeeNo = context.getBindingObject().PersonnelNumber;

    if (employeeNo.length === 0) {
        return '-';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Employees', [], `$filter=PersonnelNumber eq '${employeeNo}'&$top=1`).then(result => {
        if (result.length === 0) {
            return '-';
        }
        // TODO: Account for employee name not in dataset ?
        return result.getItem(0).EmployeeName;
    });
}
