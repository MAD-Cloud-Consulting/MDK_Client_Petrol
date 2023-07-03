import libCommon from '../../Library/CommonLibrary';

export default function PlantValueChanged(context) {
    let pageProxy = context.getPageProxy();
    let objectValue = libCommon.getControlValue(libCommon.getControlProxy(pageProxy, 'MaintenacePlantLstPkr'));
    let objectSelected = !!objectValue;

    let control = libCommon.getControlProxy(pageProxy, 'LocationLstPkr');
    let controlSpecifier = control.getTargetSpecifier();
    controlSpecifier.setQueryOptions(objectSelected ? `$filter=Plant eq '${objectValue}'` : '');
    control.setTargetSpecifier(controlSpecifier);
    control.setValue('');
    control.setEditable(objectSelected);              
}
