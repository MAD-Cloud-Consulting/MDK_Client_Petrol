import CommonLibrary from '../../../Common/Library/CommonLibrary';
import LocationCommon from '../../../Common/Controls/Data/Location';

export default function Location(context) {
    let location = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'LocationLstPkr'));
    return LocationCommon(location);
}
