import libCommon from '../../../Common/Library/CommonLibrary';

export default function TimeSheetEntriesListViewOnPageLoad(clientAPI) {
    libCommon.setStateVariable(clientAPI, 'TimeSheetDetails', false);
}
