import NativeScriptObject from './Library/NativeScriptObject';

export default function IsCompactMode(context) {
    return NativeScriptObject.getNativeScriptObject(context).platformModule.device.deviceType === 'Phone';
}
