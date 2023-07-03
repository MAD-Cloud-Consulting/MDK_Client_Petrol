import libMobile from './MobileStatusLibrary';

export default function SubOperationMobileStatus(context) {
    let binding = context.binding;
    if (binding && binding.SubOperationNo && libMobile.isSubOperationStatusChangeable()) {
        return context.localizeText(libMobile.getMobileStatus(binding, context));
    } else {
        return '';
    }
}
