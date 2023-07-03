import { BaseObservable } from 'mdk-core/observables/BaseObservable';
import { IControl } from 'mdk-core/controls/IControl';
import { ODataAction } from 'mdk-core/actions/ODataAction';

export class BaseExtensionObservable extends BaseObservable {
    public constructor(control: IControl) {
        super(control, control.definition(), control.page());
    } 

    public bindValue(value: any): Promise<any> {
        return Promise.resolve();
    }

    public onDataChanged(action: ODataAction, result: any) {
        super.onDataChanged(action, result);
        this.control.onDataChanged(action, result);
    }
};
