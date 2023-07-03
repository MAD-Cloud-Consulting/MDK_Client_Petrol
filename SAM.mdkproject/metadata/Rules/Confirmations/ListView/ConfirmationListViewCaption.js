import PersonaLibrary from '../../Persona/PersonaLibrary';

export default function ConfirmationListViewCaption(clientAPI) {
    let isFST = PersonaLibrary.isFieldServiceTechnician(clientAPI);

    return isFST ? clientAPI.localizeText('time_records') : clientAPI.localizeText('labor_time');
}
