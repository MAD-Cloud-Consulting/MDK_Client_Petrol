import NativeScriptObject from './Library/NativeScriptObject';

export default function IsIOS(clientAPI) {
    return NativeScriptObject.getNativeScriptObject(clientAPI).platformModule
        .isIOS;
}
