import failureModeGroupValue from './NotificationCreateUpdateQMCodeGroupValue';
import failureModeCodeValue from './NotificationCreateUpdateQMCodeValue';

export default function NotificationCreateUpdateQMCatalog(context) {
    let notificationType = '';
    if (context.binding) {
        notificationType = context.binding.NotificationType; // Fallback
    }
    try {
        // Get from Picker if applicable
        notificationType = context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue');
    } catch (exc) {
        // Do nothing; Notification Type should be set from binding
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${notificationType}')`, ['CatTypeCoding, CatalogProfile'], '').then(result => {
        if (failureModeGroupValue(context) && failureModeCodeValue(context)) { //If both Failure Mode Group and Code Values are populated then populate the FailureCatalogType
            return result.getItem(0).CatTypeCoding;
        } else {
            return '';
        }
    }, () => {
        return '';
    });
}
