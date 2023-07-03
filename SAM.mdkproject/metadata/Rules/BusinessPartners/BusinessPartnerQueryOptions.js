export default function BusinessPartnerQueryOptions() {
    let expandList = [
        'Address_Nav',
        'Address_Nav/AddressCommunication',
        'AddressAtWork_Nav',
        'AddressAtWork_Nav/AddressAtWorkComm',
        'PartnerFunction_Nav',
        'Employee_Nav',
        'Employee_Nav/EmployeeAddress_Nav',
        'Employee_Nav/EmployeeCommunications_Nav',
    ];
    let queryOptions = '$expand=' + expandList.join(',');
    return queryOptions;
}
