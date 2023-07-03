import ODataDate from '../../../Common/Date/ODataDate';
import ValidationLibrary from '../../Library/ValidationLibrary';

export default function ManufactureDate(control) {
    let date = new Date();
    let pageProxy = control.getPageProxy();

    if (!(ValidationLibrary.evalIsEmpty(pageProxy.binding)) && pageProxy.binding.ConstYear) {
        date.setFullYear(pageProxy.binding.ConstYear);
    }

    if (!(ValidationLibrary.evalIsEmpty(pageProxy.binding)) && pageProxy.binding.ConstMonth) {
        date.setMonth(pageProxy.binding.ConstMonth - 1);
    }

    let odataDate = new ODataDate(date).toDBDateString(control);

    control.setValue(odataDate);
}
