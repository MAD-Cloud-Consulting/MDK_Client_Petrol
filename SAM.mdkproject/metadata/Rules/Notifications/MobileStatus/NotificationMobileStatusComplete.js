import libNotifMobile from './NotificationMobileStatusLibrary';
import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import Logger from '../../Log/Logger';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import NotificationMobileStatusToolBarCaption from './NotificationMobileStatusToolBarCaption';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import HideActionItems from '../../Common/HideActionItems';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
import AutoSyncLibrary from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';

export default function NotificationMobileStatusComplete(context) {
	//Get statusElement that was set in NotificationChangeStatus.js. It will be used later on to pass into MobileStatusUpdateOverride.js which updates the mobile status in db.
	let statusElement = CommonLibrary.getStateVariable(context, 'StatusElement');
	const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
	if (statusElement.MobileStatus === COMPLETED) {
		let tasksPromises = [];
		//Check if all notification tasks are completed.
		tasksPromises.push(libNotifMobile.isAllTasksComplete(context));
		//Check if all notification item tasks are completed.
		tasksPromises.push(libNotifMobile.isAllItemTasksComplete(context));
		//Don't allow notification to be completed if all notification tasks and notification item tasks are not complete.
		return Promise.all(tasksPromises).then(results => {
			if (results[0] && results[1]) {
				return libNotifMobile.NotificationUpdateMalfunctionEnd(context).then(() => {
					//libNotifMobile.completeNotification does digital signature and device registration. The function name is misleading.
					return libNotifMobile.completeNotification(context, dummyFunction).then(() => {
						LocationUpdate(context);
						//Update the mobile status to complete in db
						return context.executeAction(MobileStatusUpdateOverride(context, statusElement, 'NotifMobileStatus_Nav', '')).then(() => {
							const notificationDetailsPage = 'NotificationDetailsPage';
							let pageContext = MobileStatusLibrary.getPageContext(context, notificationDetailsPage);
							//toolbar updates for NotificationDetails.page
							return NotificationMobileStatusToolBarCaption(pageContext, statusElement.MobileStatus).then(caption => {
								pageContext.setToolbarItemCaption('EndNotificationTbI', caption);
								CommonLibrary.enableToolBar(context, notificationDetailsPage, 'EndNotificationTbI', false);
								HideActionItems(pageContext.getPageProxy(), 2);
								return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
									AutoSyncLibrary.autoSyncOnStatusChange(pageContext);
								});
							});
						});
					});
				});
			} else {
				return context.executeAction('/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationTaskPendingError.action');
			}
		}).catch((error) => {
			Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
			return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action');
		});
	}

	//The NotificationMobileStatusLibrary.completeNotification function requires a function to be passed in that it calls once it's done.
	//We don't want its default function executeCompletionStepsAfterDigitalSignature() to be called in this case.
	//NotificationMobileStatusLibrary.completeNotification just does digital signature. It should be called doDigitalSignature(context) instead.
	//I don't want to mess with existing code, so I just created a simple dummy function here to pass in that does nothing.
	function dummyFunction() {
		return Promise.resolve();
	}
	
}
