import NativeScriptObject from './Library/NativeScriptObject';

export default function DeviceType(context) {
    return NativeScriptObject.getNativeScriptObject(context).platformModule.device.deviceType;
}
