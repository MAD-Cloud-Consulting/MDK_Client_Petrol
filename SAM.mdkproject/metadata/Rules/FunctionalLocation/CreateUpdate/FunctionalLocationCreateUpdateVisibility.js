import libCommon from '../../Common/Library/CommonLibrary';

export default function FunctionalLocationCreateUpdateVisibility(control) {
    return libCommon.IsOnCreate(control.getPageProxy());
}
