import { BaseObservable } from 'mdk-core/observables/BaseObservable';
import { IControl } from 'mdk-core/controls/IControl';

export class BaseExtensionObservable extends BaseObservable {
    public constructor(control: IControl) {
        super(control, control.definition(), control.page());
    } 

    public bindValue(value: any): Promise<any> {
        return Promise.resolve();
    }
};
