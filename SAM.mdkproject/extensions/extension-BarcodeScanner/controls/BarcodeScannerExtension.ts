import { BaseExtension } from './BaseExtension';
import { BarcodeScannerExtBridge } from 'extension-BarcodeScanner';
import { BarcodeParser } from './BarcodeParser';
import { BarcodeScannerObservable } from './BarcodeScannerObservable';
import { IDataService } from 'mdk-core/data/IDataService';
import { Utils } from './Utils';
import { EventHandler } from 'mdk-core/EventHandler';
import { ITargetServiceSpecifier } from 'mdk-core/data/ITargetSpecifier';
import { I18nHelper } from 'mdk-core/utils/I18nHelper';
import { Device } from '@nativescript/core';

export class BarcodeScannerExtension extends BaseExtension {

    protected _actionToRun: any;
    protected _itemForAction: any;
    protected _isNavigatedToEditPage = false;
    protected _isActivityNeeded = false;

    public initialize(props) {
        this._parser = new BarcodeParser();
        super.initialize(props);
        let barcodeScanner: BarcodeScannerExtBridge = new BarcodeScannerExtBridge();
        let vc = barcodeScanner.create(this.getParams(), this.getDataService(), this);
        this.setViewController(vc);
        this.page().actionBarHidden = true;
    }

    public getObjects(jsonDictionary, type) {
        super.getObjects(jsonDictionary, type).then(objects => {
            if (objects.length === 0) {
                // No items to scan
                // Do a BackNavigaton to prevent a possible crash
                this.runAction('/SAPAssetManager/Actions/Page/ClosePage.action', null);
            } else {
                if (Device.os === 'Android') {
                    jsonDictionary.BusinessObjects = objects;
                    this._bridge.callback(JSON.stringify(jsonDictionary), type);
                } else {
                    jsonDictionary.Objects = objects;
                    this._bridge.callback(jsonDictionary, type);
                }
            }
        });
    }

    public getTargetService(data): ITargetServiceSpecifier {
        let tss = super.getTargetService(data);
        tss.queryOptions = this._parser.parseValue(tss.queryOptions, this.page().context);
        if (data.Target.ReadLink) {
            tss.readLink = data.Target.ReadLink;
            delete tss.keyProperties;
        }
        return tss;
    }

    public runActionWithInfoAndService(actionInfo, type, dataService) {
        let context = this.page().context;
        switch (type) {
            case 'Confirm':
                try {
                    super.ODataUpdate(actionInfo).then(result => {
                        if (result) {
                            this._bridge.callback(result, 'Confirm');
                        } else {
                            this._bridge.callback(result, 'Empty');
                        }
                    }, reject => {
                        console.log(reject);
                        this._bridge.callback(JSON.stringify(this.getErrorJSON()), 'Error');
                    });
                } catch (error) {
                    this._bridge.callback(error, 'Error');
                }
                break;
            case 'Edit':
                let action = actionInfo.Action;
                let target = actionInfo.Target;
                actionInfo.Target.EntitySet = this._parser.parseValue(target.EntitySet, this.page().context);
                if (target) {
                    this._isNavigatedToEditPage = true;
                    dataService.read(this.getTargetService(actionInfo)).then(result => {
                        if (result.length === 1) {
                            let item = result.getItem(0);
                            if (Device.os === 'Android') {
                                this._actionToRun = action;
                                this._itemForAction = item;
                            } else {
                                this.runAction(action, item).then(results => {
                                    if (results) {
                                        this._bridge.callback(results, 'Edit');
                                    } 
                                }).catch(error => {
                                       this._bridge.callback(error, 'Empty');
                                });
                            }
                        } else {
                            this.runAction(action, null);
                        }
                    });
                } else {
                    this.runAction(action, null);
                }
                break;
            case 'BackNavigation':
                let backNavAction = this.definition()._data.ExtensionProperties.BackNavigation;
                if (backNavAction) {
                    this.runAction(backNavAction, null);
                } else {
                    this.runAction('/SAPAssetManager/Actions/Page/ClosePage.action', null);
                }
            default:
                this._bridge.callback(JSON.stringify(actionInfo), 'Undefined');
                break;
        }
    }

    public getErrorJSON() {
        let errorTitle = I18nHelper.localizeExtensionText('bc_action_err_title',
            'extension-BarcodeScanner', [], this.androidContext());
        let errorMessage = I18nHelper.localizeExtensionText('bc_action_err_update', 
            'extension-BarcodeScanner', [], this.androidContext());
        return {ErrorTitle: errorTitle, ErrorMessage: errorMessage};
    }

    public onPageLoaded(initialLoading: Boolean) {
        // Workaround: Bring up Edit screen
        if (!initialLoading && this._actionToRun != null) {
            let action = this._actionToRun;
            let item = this._itemForAction;
            this._actionToRun = null;
            this._itemForAction = null;
            this.runAction(action, item);
        }
    }

    public onDismissingModal() {
        this._bridge.callback('', 'Edit');
    }
};
