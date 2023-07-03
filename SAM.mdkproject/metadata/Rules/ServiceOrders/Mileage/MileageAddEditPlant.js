import MileageAddEditWorkCenter from './MileageAddEditWorkCenter';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAddEditPlant(pageProxy) {

    let externalWorkCenter = MileageAddEditWorkCenter(pageProxy);

    return CommonLibrary.getPlantFromWorkCenter(pageProxy, externalWorkCenter).then(plant => {
        return plant ? plant : '';
    });
}
