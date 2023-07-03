import libCom from '../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import GetMaterialNumMaterialDocItem from './GetMaterialNumMaterialDocItem';

export default function SerialNumbersTarget(context) {
    const target = context.binding;
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers').actual;
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const stockType = 'StockTransportOrderItem';
    const puchaseType = 'PurchaseOrderItem';
    const inboudnType = 'InboundDeliveryItem';
    const outboundType = 'OutboundDeliveryItem';
    const materialType = 'MaterialSLoc';
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const readLink = CreateReadLink(context, objectType, type);

    if (!serialNumbers) {
        let arr = [];
        let serialNumberNav = '';

        if (!target || ((objectType === 'MAT' || objectType === 'TRF') && type === materialType)) {
            return GetMaterialSerialNumbers(context, readLink).then(data => {
                libCom.setStateVariable(context, 'SerialNumbers', {actual: data, initial: JSON.parse(JSON.stringify(data))});
                return data;
            });
        } else if (target.SerialNum) {
            serialNumberNav = 'SerialNum';
        } else if (type === stockType ) {
            serialNumberNav = 'STOSerialNumber_Nav';
        } else if (type === puchaseType) {
            serialNumberNav = 'POSerialNumber_Nav';
        } else if (type === inboudnType) {
            serialNumberNav = 'InboundDeliverySerial_Nav';
        } else if (type === outboundType) {
            serialNumberNav = 'OutboundDeliverySerial_Nav';
        }

        arr = target[serialNumberNav].map(item => {
            if (type === outboundType || type === inboudnType) {
                return {
                    SerialNumber: item.SerialNumber || item.SerialNum,
                    selected: item.IsDownloaded !== 'X',
                    downloaded: !target.SerialNum,
                };
            }
            return {
                SerialNumber: item.SerialNumber || item.SerialNum,
                selected: !!target.SerialNum || !!target.PickedQuantity,
                downloaded: !target.SerialNum, 
            };
        });

        if (type === puchaseType || type === stockType) {
            arr = GetMaterialNumMaterialDocItem(target, arr, type === stockType);
        }

        if (type === 'MaterialDocItem') {
            let headArr = [];
            if (target.PurchaseOrderItem_Nav) {
                headArr = target.PurchaseOrderItem_Nav.POSerialNumber_Nav || [];
            } else if (target.StockTransportOrderItem_Nav) {
                headArr = target.StockTransportOrderItem_Nav.STOSerialNumber_Nav || [];
            } else if (objectType === 'ADHOC' || objectType === 'TRF') {
                return GetMaterialSerialNumbers(context, readLink).then(data => {
                    headArr = data;

                    arr = CreateArrForMaterialDocItem(target, headArr, arr);
                    if (SplitReadLink(readLink).MaterialNum !== target.Material) {
                        arr = [];
                    }
                    libCom.setStateVariable(context, 'SerialNumbers', {actual: arr, initial: JSON.parse(JSON.stringify(arr))});

                    return arr;
                });
            }

            arr = CreateArrForMaterialDocItem(target, headArr, arr);
        }

        libCom.setStateVariable(context, 'SerialNumbers', {actual: arr, initial: JSON.parse(JSON.stringify(arr))});

        return arr;
    } else {
        return serialNumbers;
    }
}

function CreateArrForMaterialDocItem(target, headArr, arr) {
    if (headArr.length) {
        headArr = headArr.map(item => {
            return {
                SerialNumber: item.SerialNumber || item.SerialNum,
                selected: false,
                downloaded: true, 
            };
        });

        if (target.PurchaseOrderItem_Nav || target.StockTransportOrderItem_Nav) {
            headArr = GetMaterialNumMaterialDocItem(target, headArr, target.StockTransportOrderItem_Nav);
        }

        for (let i = 0; i < arr.length; i++) {
            const copyItem = headArr.find(item => item.SerialNumber === arr[i].SerialNumber);
            if (copyItem) {
                arr[i].copy = true;
                copyItem.selected = true;
            }
        }

        return [...headArr, ...arr.filter(item => !item.copy)];
    }

    return arr;
}

function GetMaterialSerialNumbers(context, readLink) {
    const splitReadLink = SplitReadLink(readLink);
    const query = `$filter=Plant eq '${splitReadLink.Plant}' and StorageLocation eq '${splitReadLink.StorageLocation}'`;
    const entitySet = readLink + '/Material/SerialNumbers';
    const arr = [];

    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], query).then(data => {
        for (let i = 0; i < data.length; i++) {
            arr.push({
                SerialNumber: data.getItem(i).SerialNumber,
                selected: false,
                downloaded: true, 
            });
        }

        return arr;
    }); 
}

function CreateReadLink(context, objectType, type) {
    const binding = context.binding;
    if (binding && (objectType === 'ADHOC' || objectType === 'TRF') && type !== 'MaterialSLoc') {
        return `MaterialSLocs(Plant='${binding.Plant}',StorageLocation='${binding.StorageLocation}',MaterialNum='${binding.Material}')`;
    }

    return libCom.getStateVariable(context, 'MaterialReadLink');
}
