import libPersona from '../Persona/PersonaLibrary';

export default function FSMOverviewOnPageReturning(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        let sectionedTable = context.getControls()[0];
        let mapSection = sectionedTable.getSections()[7];
        let mapViewExtension = mapSection.getExtensions()[0];
        mapViewExtension.update();
    }
}
