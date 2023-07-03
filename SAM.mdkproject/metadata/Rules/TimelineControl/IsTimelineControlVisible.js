import common from '../Common/Library/CommonLibrary';
import personaLib from '../Persona/PersonaLibrary';
export default function IsTimelineControlVisible(context) {
    let isVisible = false;
    ///Enable control Visibility based on FSM persona and assigment type
    let entityset = common.getEntitySetName(context);
    switch (entityset) {
        case 'MyWorkOrderHeaders':
            isVisible = (common.getWorkOrderAssnTypeLevel(context) === 'Header' && personaLib.isFieldServiceTechnician(context));
            break;
        case 'MyWorkOrderOperations':
            isVisible = (common.getWorkOrderAssnTypeLevel(context) === 'Operation' && personaLib.isFieldServiceTechnician(context));
            break;
        case 'MyWorkOrderSubOperations':
            isVisible = (common.getWorkOrderAssnTypeLevel(context) === 'SubOperation' && personaLib.isFieldServiceTechnician(context));
            break;
        default:
            break;
    }
    return isVisible;   
}
