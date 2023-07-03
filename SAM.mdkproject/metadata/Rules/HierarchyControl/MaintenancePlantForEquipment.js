export default function HierachyListPickerQueryOptionsForEquipment(controlProxy) {
    let context;
    let maintenacePlant = controlProxy.binding.MaintPlant || '';
    try {
        context = controlProxy.getPageProxy();
    } catch (err) {
        controlProxy = controlProxy.binding.clientAPI;
        context = controlProxy.getPageProxy();
        let maintenacePlantLstPkr = context.getControl('FormCellContainer').getControl('MaintenacePlantLstPkr').getValue();

        let maintenacePlantLstPkrValue = maintenacePlantLstPkr && maintenacePlantLstPkr.length ? maintenacePlantLstPkr[0].ReturnValue : '';
    
    
        if (maintenacePlantLstPkrValue) {
            maintenacePlant = maintenacePlantLstPkrValue;
        }
    }
    return maintenacePlant;
}
