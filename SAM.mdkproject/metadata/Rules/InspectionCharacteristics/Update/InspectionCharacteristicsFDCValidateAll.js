import inspCharLib from './InspectionCharacteristics';

export default function InspectionCharacteristicsFDCValidateAll(context) {
    let extension = context.getPageProxy().getControl('FormCellContainer')._control;

    let sections = extension.sectionsContexts;
    if (sections && sections.length > 0) {
        for (let i=0; i < sections.length; i++) {
            let section = sections[i];
            inspCharLib.validateCharacteristic(extension, section, i, context);
        }
    }
    return true;
}
