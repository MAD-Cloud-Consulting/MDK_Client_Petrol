import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function NotificationDetailsQueryOptions(context) {
    if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        return '$select=QMCodeGroup,QMCode,NotificationNumber,NotificationDescription,NotifMobileStatus_Nav/MobileStatus,NotificationType,NotifPriority/Priority,NotifPriority/PriorityDescription&$expand=NotifPriority,NotifMobileStatus_Nav,NotifMobileStatus_Nav/OverallStatusCfg_Nav';
    } else {
        return '$select=NotificationNumber,NotificationDescription,NotifMobileStatus_Nav/MobileStatus,NotificationType,NotifPriority/Priority,NotifPriority/PriorityDescription&$expand=NotifPriority,NotifMobileStatus_Nav,NotifMobileStatus_Nav/OverallStatusCfg_Nav';
    }
}
