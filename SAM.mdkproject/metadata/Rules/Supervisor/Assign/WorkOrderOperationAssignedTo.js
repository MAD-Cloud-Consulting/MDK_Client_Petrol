export default function WorkOrderOperationAssignedTo(context) {
    let binding = context.binding;
    
    if (binding.Employee_Nav) {
        return Promise.resolve(binding.Employee_Nav.EmployeeName);
    }
    
    return Promise.resolve(context.localizeText('unassigned'));
}
