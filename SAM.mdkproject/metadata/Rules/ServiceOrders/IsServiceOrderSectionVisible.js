import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';

export default function IsServiceOrderSectionVisible(context) {
    return MobileStatusLibrary.isHeaderStatusChangeable(context);
}
