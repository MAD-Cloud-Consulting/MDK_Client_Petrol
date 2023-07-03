import { BaseObservable } from 'mdk-core/observables/BaseObservable';
import { Context } from 'mdk-core/context/Context';
import { IControl } from 'mdk-core/controls/IControl';
import { BaseExtensionObservable } from './BaseExtensionObservable';

export class BarcodeScannerObservable extends BaseExtensionObservable {
    public constructor(control: IControl) {
        super(control);
    }   
};
