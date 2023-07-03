import {CreateUpdateFunctionalLocationEventLibrary as libFLOC} from '../../FunctionalLocationLibrary';
import LocationCommon from '../../../Common/Controls/Data/Location';

export default function Location(context) {
    let location = libFLOC.getControlValue(context, 'LocationLstPkr');
    return LocationCommon(location);
}
