import CommonLibrary from '../Common/Library/CommonLibrary';
import IsServiceReportEnabled from './IsServiceReportEnabled';

export default function IsPDFAllowedForOrder(clientAPI) {
    return IsServiceReportEnabled(clientAPI) && CommonLibrary.getWorkOrderAssnTypeLevel(clientAPI) === 'Header';
}
