import Logger from './Logger';
import NativeScriptObject from '../Common/Library/NativeScriptObject';

export default function InitializeLoggerAndNativeScriptObject(clientAPI) {
  // Log file is located in Application's Documents folder.
    Logger.init(clientAPI);
    NativeScriptObject.init(clientAPI);
}
