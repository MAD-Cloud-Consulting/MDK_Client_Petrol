export default function WorkOrderAssignPartnerLink(context) {
    var links = [];
    let woLink = context.createLinkSpecifierProxy(
        'WorkOrderHeader', 
        'MyWorkOrderHeaders', 
        '',
        context.getClientData().OrderReadLink
    );
    links.push(woLink.getSpecifier());
    let empLink = context.createLinkSpecifierProxy(
        'Employee_Nav', 
        'Employees', 
        '',
        context.getClientData().EmployeeReadLink
    );
    links.push(empLink.getSpecifier());
    return links;
}
