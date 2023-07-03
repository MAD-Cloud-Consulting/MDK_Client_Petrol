import libStatus from './MobileStatusLibrary';

export default function MobileStatusCaption(context) {	
    return context.localizeText(libStatus.mobileStatus(context, context.binding));
}
