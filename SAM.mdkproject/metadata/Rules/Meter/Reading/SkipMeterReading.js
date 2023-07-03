import libCommon from '../../Common/Library/CommonLibrary';
import Stylizer from '../../Common/Style/Stylizer';

export default function SkipMeterReading(context) {
    let noteValue = context.getValue()[0].ReturnValue;
    let estimateReadingNote = libCommon.getAppParam(context, 'METERREADINGNOTE', 'EstimateMeterReading');
    let resolvedControl = context.getPageProxy().getControl('ReadingValue');
    if (!resolvedControl && context.getPageProxy().getControls().length > 0) {
        resolvedControl = context.getPageProxy().getControls()[0]._control.controls.find(function(entity) {
            return entity.controlProxy.getName() === 'ReadingValue' + context.getName().substr(context.getName().length - 4);
        });
    } else {
        return;
    }
    let setEditableFunction = libCommon.setFormcellNonEditable;
    let stylizer = new Stylizer(['FormCellTextEntry']);
    if (!(noteValue === estimateReadingNote)) {
        setEditableFunction = libCommon.setFormcellEditable;
        stylizer = new Stylizer(['GrayText']);
    }

    setEditableFunction(resolvedControl);
    stylizer.apply(resolvedControl, 'Value');
}
