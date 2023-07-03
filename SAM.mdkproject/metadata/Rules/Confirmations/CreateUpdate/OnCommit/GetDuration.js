import libCom from '../../../Common/Library/CommonLibrary';

export default function GetDuration(context) {

    let durationControlValue = libCom.getControlProxy(context,'DurationPkr').getValue();
    return durationControlValue.toString();
}
