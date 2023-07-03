import NativeScriptObject from './Library/NativeScriptObject';

export default function IsAndroid(context) {
    if (NativeScriptObject.getNativeScriptObject(context).platformModule.isAndroid) {
        return true;
    } else {
        return false;
    }
}
