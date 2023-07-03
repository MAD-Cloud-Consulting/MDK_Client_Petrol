import libCommon from '../../Common/Library/CommonLibrary';
import enableMaintenanceTechnician from '../../SideDrawer/EnableMaintenanceTechnician';
import enableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

export default function IsOperationLevelAssigmentType(context) {
     if (enableMaintenanceTechnician(context) || enableFieldServiceTechnician(context)) {
          return (libCommon.getWorkOrderAssnTypeLevel(context) === 'Operation');
     }
     return false;
}
