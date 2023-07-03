export default function DefaultEmployees(context) {
    let employee = context.getPageProxy().binding.Employee;
    if (employee) {
        return employee.PersonnelNumber;
    } else {
        return '';
    }
}
