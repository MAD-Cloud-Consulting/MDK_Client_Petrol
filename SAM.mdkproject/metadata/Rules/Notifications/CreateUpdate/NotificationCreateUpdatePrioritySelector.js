import notification from '../NotificationLibrary';

export default function NotificationCreateUpdatePrioritySelector(context) {
    let breakdownSwitchPromise = Promise.resolve(false); // Assume non-QM notification
    if (context.getValue().length > 0) {
        breakdownSwitchPromise = context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${context.getValue()[0].ReturnValue}')`, [], '').then(result => {
            return result.getItem(0) && result.getItem(0).NotifCategory === '02';
        });
    }
    let prioritySelectorPromise = notification.NotificationCreateUpdatePrioritySelector(context);

    return Promise.all([prioritySelectorPromise, breakdownSwitchPromise]).then(results => {
        if (results[1] === true) {
            context.getPageProxy().evaluateTargetPathForAPI('#Control:BreakdownSwitch').setVisible(false);
        } else {
            context.getPageProxy().evaluateTargetPathForAPI('#Control:BreakdownSwitch').setVisible(true);
        }
    });
}
