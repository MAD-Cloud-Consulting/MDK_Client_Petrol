import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function CrewVehicleSuccessMessageWithAutoSync(context) {
  return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Crew/CrewVehicleSuccessMessage.action');
}
