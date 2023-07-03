import setCaption from './InspectionLotListViewSetCaption';
import libCommon from '../../Common/Library/CommonLibrary';

export default function InspectionLotListViewOnLoad(clientAPI) {
    libCommon.setStateVariable(clientAPI, 'INSPECTION_LOT_FILTER', '');
    setCaption(clientAPI);
}
