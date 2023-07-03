import CommonLibrary from '../Common/Library/CommonLibrary';
import IsServiceReportEnabled from './IsServiceReportEnabled';

export default function IsPDFAllowedForOperation(clientAPI) {
    return IsServiceReportEnabled(clientAPI) && CommonLibrary.getWorkOrderAssnTypeLevel(clientAPI) === 'Operation';
}
