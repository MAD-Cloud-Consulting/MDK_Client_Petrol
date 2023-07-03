import NativeScriptObject from '../Common/Library/NativeScriptObject';

export default function ChartHeight(context) {
    if (NativeScriptObject.getNativeScriptObject(context).platformModule.isAndroid && NativeScriptObject.getNativeScriptObject(context).platformModule.device.deviceType === 'Phone') {
        return '290';
    } else {
        return '500';
    }
}
