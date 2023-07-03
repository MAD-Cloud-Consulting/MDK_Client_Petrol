import libCommon from '../../Common/Library/CommonLibrary';

export default function MeterPremiseOnValueChange(context) {
    let formCellContainer = context.getPageProxy().getControl('FormCellContainer');

    //get premise new value
    let premiseControlValue = formCellContainer.getControl('PremiseLstPkr').getValue();

    let installationControl = formCellContainer.getControl('InstallationLstPkr');
    var installCtrlSpecifier = installationControl.getTargetSpecifier();

    if (premiseControlValue) {
        installCtrlSpecifier.setQueryOptions(`$filter=Premise eq '${libCommon.getListPickerValue(premiseControlValue)}'`);
    } else {
        installCtrlSpecifier.setQueryOptions('');
    }
    installationControl.setTargetSpecifier(installCtrlSpecifier);
}
