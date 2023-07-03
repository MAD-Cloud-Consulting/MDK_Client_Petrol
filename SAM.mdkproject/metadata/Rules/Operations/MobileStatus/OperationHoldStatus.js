import libOprMobile from './OperationMobileStatusLibrary';

export default function OperationHoldStatus(context) {
    return libOprMobile.holdOperation(context);
}
