import libMobile from './MobileStatusLibrary';

export default function OperationMobileStatus(context) {
    let binding = context.binding;
    if (binding && binding.OperationNo && libMobile.isOperationStatusChangeable()) {
        let mobileStatus = libMobile.getMobileStatus(context.binding, context);
        if (mobileStatus === 'D-COMPLETE') {
            return '';
        }
        return context.localizeText(mobileStatus);
    } else {
        return '';
    }
}
