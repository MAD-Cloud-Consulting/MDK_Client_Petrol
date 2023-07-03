import libMobile from '../../../MobileStatus/MobileStatusLibrary';

export default function NotificationTaskDetailsMobileStatus(context) {
    return libMobile.mobileStatus(context, context.getPageProxy().binding).then(function(mStatus) {
        return context.localizeText(mStatus);
    });
}
