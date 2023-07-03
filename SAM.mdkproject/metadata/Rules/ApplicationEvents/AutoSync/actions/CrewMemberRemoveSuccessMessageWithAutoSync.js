import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function CrewMemberRemoveSuccessMessageWithAutoSync(context) {
  return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Crew/CrewMemberRemoveSuccessMessage.action');
}
