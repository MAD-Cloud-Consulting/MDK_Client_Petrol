
import IconUtils from './IconUtils';
import libPersona from '../../Persona/PersonaLibrary';

const icon = 'MarkerJob';
const serviceOrder = 'ServiceOrder';

export default function WorkOrderIcon(context) {
    const activePersona = libPersona.getActivePersona(context);
    if (activePersona === 'FIELD_SERVICE_TECHNICIAN') {
        return IconUtils.getIcon(context, serviceOrder);
    } else {
        return IconUtils.getIcon(context, icon);
    }

}
