
export default function WorkOrderDetailsNavQueryOptions() {
    return '$select=WOPartners/PartnerFunction,WOPartners/Employee_Nav/EmployeeName,CostCenter,WODocuments/DocumentID,ObjectKey,MaintenanceActivityType,OrderType,'
    + 'Priority,DueDate,HeaderEquipment,OrderDescription,OrderId,MainWorkCenter,MainWorkCenterPlant,PlanningPlant,OrderMobileStatus_Nav/MobileStatus,'
    + 'OrderMobileStatus_Nav/CreateUserGUID,WOPriority/PriorityDescription,MarkedJob/PreferenceValue,ObjectNumber'
    + '&$expand=WODocuments,WODocuments/Document,OrderMobileStatus_Nav,Operations,Operations/SubOperations,WOPriority,MarkedJob,UserTimeEntry_Nav,WOPartners,WOPartners/Employee_Nav';
}
