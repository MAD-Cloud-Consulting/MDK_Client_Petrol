import libCommon from '../../Common/Library/CommonLibrary';

export default function TransferToUpdate(context) {

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        let assnType = libCommon.getWorkOrderAssignmentType(context);
        let clientData = context.getClientData();
        clientData.EmployeeFrom = '';
        clientData.EmployeeTo = '';
        clientData.PlannerGroupFrom = '';
        clientData.PlannerGroupTo = '';
        clientData.UserFrom = '';
        clientData.UserTo = '';
        clientData.WorkCenterFrom = '';
        clientData.WorkCenterTo = '';
        clientData.WorkCenterFrom = '';
        clientData.WorkCenterTo  = '';
        switch (assnType) {
            case '1':
            case '2':
            case '3':
                clientData.EmployeeFrom = context.binding.EmployeeFrom;
                clientData.EmployeeTo = context.binding.EmployeeTo;
                return context.binding.EmployeeTo;
            case '7':
                clientData.UserFrom = context.binding.UserFrom;
                clientData.UserTo = context.binding.UserTo;
                return context.binding.UserTo;
            case '6':
                clientData.WorkCenterFrom = context.binding.WorkCenterFrom;
                clientData.WorkCenterTo = context.binding.WorkCenterTo;
                return context.binding.WorkCenterTo;
            case '8':
                clientData.WorkCenterFrom = context.binding.WorkCenterFrom;
                clientData.WorkCenterTo = context.binding.WorkCenterTo;
                return context.binding.WorkCenterTo;
            case '4':
                break;
            case '5':
                clientData.PlannerGroupFrom = context.binding.PlannerGroupFrom;
                clientData.PlannerGroupTo = context.binding.PlannerGroupTo;
                return context.binding.PlannerGroupTo;
            case 'A':
                break;
            default:
                break;
        }
    }

    return '';
}
