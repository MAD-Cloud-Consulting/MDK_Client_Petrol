import CommonLibrary from '../Common/Library/CommonLibrary';

export default function ExpenseCreateUpdateWorkCenterOnValueChange(control) {
    let pageProxy = control.getPageProxy();
    let workCenter = control.getValue()[0] ? control.getValue()[0].ReturnValue : '';
    let activityTypeListPicker = CommonLibrary.getControlProxy(pageProxy,'ExpenseTypeLstPkr');

    if (workCenter) {
        return CommonLibrary.buildActivityTypeQueryOptions(pageProxy, workCenter).then(options => {
            if (options) {
                let target = activityTypeListPicker.getTargetSpecifier();
                target.setQueryOptions(options);
                activityTypeListPicker.setValue('');
                activityTypeListPicker.setTargetSpecifier(target);
            }
            return Promise.resolve();
        });
    } else {
        activityTypeListPicker.setEditable(false);
        activityTypeListPicker.setValue('');
    }

}
