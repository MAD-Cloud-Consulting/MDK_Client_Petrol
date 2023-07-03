/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PriorityAssessmentNav(context) {
	if (context.getPageProxy().evaluateTargetPath('#Control:TypeLstPkr/#Value').length === 1) {
		return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/PriorityAssessmentNav.action');
	} else {
		return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/SelectTypeMessage.action');
	}
}
