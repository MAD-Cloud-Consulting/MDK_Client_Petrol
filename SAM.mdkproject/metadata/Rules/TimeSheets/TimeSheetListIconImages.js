import isAndroid from '../Common/IsAndroid';
import {TimeSheetDetailsLibrary as libTSDetails} from './TimeSheetLibrary';

export default function TimeSheetListIconImages(pageProxy) {

    return libTSDetails.TimeSheetListIconImages(pageProxy).then(function(result) {
        if (result) {
            return [isAndroid(pageProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
        } else {
            return [];
        }
    });
}
