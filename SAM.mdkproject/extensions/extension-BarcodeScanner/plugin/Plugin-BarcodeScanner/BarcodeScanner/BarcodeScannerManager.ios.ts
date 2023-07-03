declare var BarcodeScannerExtBridge: any;
import {BarcodeScannerControlDelegate} from '../Common/BarcodeScannerControlDelegate';

export class BarcodeScanner {
     public create(params, dataService, barcodeScannerExtension): any {
        let bridge = BarcodeScannerExtBridge.new();
        barcodeScannerExtension._bridge = bridge;
        let barcodeScannerDelegate = 
        BarcodeScannerControlDelegate.initWithDataServiceAndBridge(dataService, 
                                                         bridge, 
                                                         barcodeScannerExtension);
        return bridge.createWithParamsAndDelegate(params, barcodeScannerDelegate);
    }
};
