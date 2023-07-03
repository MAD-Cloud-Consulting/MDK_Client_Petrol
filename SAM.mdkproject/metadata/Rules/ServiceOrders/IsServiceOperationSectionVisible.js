import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';

export default function IsServiceOperationSectionVisible(context) {
    return MobileStatusLibrary.isOperationStatusChangeable(context);
}
