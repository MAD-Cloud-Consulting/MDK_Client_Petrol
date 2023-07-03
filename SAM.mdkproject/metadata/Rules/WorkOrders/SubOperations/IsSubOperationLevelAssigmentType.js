import enableMaintenanceTechnician from '../../SideDrawer/EnableMaintenanceTechnician';
import libCommon from '../../Common/Library/CommonLibrary';

export default function IsSubOperationLevelAssigmentType(context) {
     if (enableMaintenanceTechnician(context)) {
          //Return true if Sub Operation level assigment type
          return (libCommon.getWorkOrderAssnTypeLevel(context) === 'SubOperation');
     }
     return false;
}
