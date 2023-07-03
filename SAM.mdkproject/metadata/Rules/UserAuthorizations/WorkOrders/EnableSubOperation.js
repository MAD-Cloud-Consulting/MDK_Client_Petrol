/**
* Show/Hide SubOperation Button
* @param {IClientAPI} context
*/
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import EnableWorkOrderEdit from './EnableWorkOrderEdit';

export default function EnableSubOperation(context) {

    if (!IsPhaseModelEnabled(context)) {
        return EnableWorkOrderEdit(context).then(isEditEnabled => {
            return isEditEnabled;
        });
    }

    return Promise.resolve(false);
}
