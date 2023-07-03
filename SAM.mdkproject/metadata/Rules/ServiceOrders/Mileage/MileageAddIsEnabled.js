
import MileageAddCheckIfObjectIsCompleted from './MileageAddCheckIfObjectIsCompleted';
import MileageIsEnabled from './MileageIsEnabled';

export default function MileageAddIsEnabled(context) {

    if (MileageIsEnabled(context)) {
        return MileageAddCheckIfObjectIsCompleted(context);
    } else {
        return Promise.resolve(false);
    }

}
