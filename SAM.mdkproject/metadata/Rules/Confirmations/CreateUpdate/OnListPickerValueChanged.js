import libCom from '../../Common/Library/CommonLibrary';
import actPickerQueryOptions from './ActivityPickerQueryOptions';

let propertyMap = {
    'ActivityTypePkr': 'ActivityType',
    'SubOperationPkr': 'SubOperation',
    'VarianceReasonPkr': 'VarianceReason',
    'AcctIndicatorPkr': 'AccountingIndicator',
};

export default function OnListPickerValueChanged(context) {
    let controlName = context.getName();
    let propertyKey = propertyMap[controlName];
    if (propertyKey === undefined) {
        return '';
    }
    if (controlName === 'SubOperationPkr') { //Get the default activity type for this sub-operation
        let pageProxy = context.getPageProxy();

        return actPickerQueryOptions(pageProxy).then((queryOptions) => {
            let control = libCom.getControlProxy(pageProxy, 'ActivityTypePkr');
            let specifier = control.getTargetSpecifier();
            specifier.setQueryOptions(queryOptions);

            return control.setTargetSpecifier(specifier).then(() => {
                control.redraw();
                if (pageProxy.getClientData().DefaultActivityType) {  //Default the activity type to the suboperation's activity type if empty
                    if (!libCom.getListPickerValue(libCom.getControlProxy(pageProxy,'ActivityTypePkr').getValue())) {
                        control.setValue(pageProxy.getClientData().DefaultActivityType);
                    }
                }
                return Promise.resolve(true);
            });
        });
    }
}
