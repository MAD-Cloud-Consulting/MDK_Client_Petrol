import libCommon from '../Common/Library/CommonLibrary';

export default function BreakdownSwitchValue(context) {
    let value = libCommon.getTargetPathValue(context, '#Control:BreakdownSwitch/#Value');
    return value === true ? true : false;
}
