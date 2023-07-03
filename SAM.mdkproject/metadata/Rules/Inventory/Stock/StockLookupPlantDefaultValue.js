import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function StockLookupPlantDefaultValue() {
    return CommonLibrary.getUserDefaultPlant() ?  CommonLibrary.getUserDefaultPlant() : '';
}
