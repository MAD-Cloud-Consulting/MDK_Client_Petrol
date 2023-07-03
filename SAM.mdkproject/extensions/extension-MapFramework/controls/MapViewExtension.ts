import { MapExtension } from './MapExtension';
import { Device } from '@nativescript/core';

export class MapViewExtension extends MapExtension {
    public view() {
        if (Device.os === 'Android') {
            return super.view();
        } else {
            return super.view().view;
        }
    }
}
