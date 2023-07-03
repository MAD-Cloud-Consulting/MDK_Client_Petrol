export default function PeakUsageShowHideMultiple(context) {
    let peakTimeControl = context.getPageProxy().getControl('PeakUsageTimeControl');

    if (!peakTimeControl) {
        peakTimeControl = context.getPageProxy().getControls()[0]._control.controls.find(function(entity) {
            return entity.controlProxy.getName() === 'PeakUsageTimeControl' + context.getName().substr(context.getName().length - 4);
        });
    }

    peakTimeControl.setVisible(context.getValue());
}
