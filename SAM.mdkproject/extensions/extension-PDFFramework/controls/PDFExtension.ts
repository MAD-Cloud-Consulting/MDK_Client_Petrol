import { BaseExtension } from './BaseExtension';
import { PDFControl} from 'extension-PDFFramework';
import { Device } from '@nativescript/core';

export class PDFExtension extends BaseExtension {

    public initialize(props) {
        super.initialize(props);
        let pdfControl: PDFControl = new PDFControl();
        let vc = pdfControl.create(this.getDataService(), this);
        this.setViewController(vc);
        this.parseProperties();
    }
    public parseProperties() {
        this.parseProperty(this.getParams().Template).then(template => {
            this.parseProperty(this.getParams().Data).then(data => {
                let createParams = {Template:template, Data:JSON.stringify(data)}
                this._bridge.callback(Device.os === 'Android' ? JSON.stringify(createParams) : createParams, "Create");
            });
        });
    }
    public save(path, fileName) {
        let saveParams = {Path:path, FileName:fileName}
        this._bridge.callback(Device.os === 'Android' ? JSON.stringify(saveParams) : saveParams, "Save");
    }
    public share() {
        this._bridge.callback(Device.os === 'Android' ? JSON.stringify({}) : {}, "Share");
    }
    private parseProperty(param): Promise<any> {
        if (param.indexOf('.action') >= 0 || (param.indexOf('.js') >= 0)) {
            return this.executeActionOrRule(param);
        } else {
            return Promise.resolve(param);
        }
    }

    public update() {
        this.parseProperties();
    }
}
