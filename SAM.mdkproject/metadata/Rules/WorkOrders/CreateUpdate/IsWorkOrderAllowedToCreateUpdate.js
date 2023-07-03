import IsSupervisorEnableWorkOrderCreate from '../../Supervisor/SupervisorRole/IsSupervisorEnableWorkOrderCreate';

export default function IsWorkOrderAllowedToCreateUpdate(context) {
    return IsSupervisorEnableWorkOrderCreate(context);
}
