export default function TimeEntryEmployeeName(context) {
    let binding = context.getPageProxy().binding;

    if (binding.Employee) {
        let name = binding.Employee.EmployeeName;
        return name;
    }
    return '-';
}
