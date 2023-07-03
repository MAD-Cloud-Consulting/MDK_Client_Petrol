import GetStorageBin from '../Validation/GetStorageBin';
import GetPurchaseOrderItemsOpenQuantitiesText from '../PurchaseOrder/GetPurchaseOrderItemsOpenQuantitiesText';
import GetMaterialName from '../../Common/GetMaterialName';
import InboundOutboundDeliveryQuantity from '../InboundOrOutbound/InboundOutboundDeliveryQuantity';
import GetMaterialDesc from './GetMaterialDesc';
import GetValuationType from '../IssueOrReceipt/Valuations/GetValuationType';

export default function ItemDetailsTarget(context) {
    const item = context.getPageProxy().getClientData().item || context.binding;
    const movementTypes = ['201', '221', '261', '281', '501'];
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const purchaseType = 'PurchaseOrderItem';
    const stockType = 'StockTransportOrderItem';
    const reservationType = 'ReservationItem';
    const inboundType = 'InboundDeliveryItem';
    const outboundType = 'OutboundDeliveryItem';
    const physicType = 'PhysicalInventoryDocItem';
    const productionItemType = 'ProductionOrderItem';
    const productionCompType = 'ProductionOrderComponent';

    const commonFields = {
        ItemNum: item.ItemNum,
        PLantSLoc: getPlantSLoc(item.Plant, item.StorageLoc),
        Material: item.MaterialNum,
        MaterialDesc: item.ItemText,
        QuantityUOM: '',
        StockType: context.localizeText(getStockType(item.StockType)),
        StorageBin: item.StorageBin,
        Batch: item.Batch,
    };

    if (type === purchaseType) {
        commonFields.Batch = item.ScheduleLine_Nav[0] && item.ScheduleLine_Nav[0].Batch;
        commonFields.Vendor = item.PurchaseOrderHeader_Nav.Vendor;
        commonFields.QuantityUOM = GetPurchaseOrderItemsOpenQuantitiesText(context, item, true);
        commonFields.StorageBin = GetStorageBin(context, item);
    } else if (type === physicType) {
        commonFields.ItemNum = item.Item;
        commonFields.QuantityUOM = item.EntryQuantity + ' ' + item.BaseUOM;
        commonFields.StorageBin = item.MaterialSLoc_Nav.StorageBin;
        commonFields.ZeroCount = item.ZeroCount ? context.localizeText('yes') : context.localizeText('no');
        commonFields.Serialized = item.MaterialPlant_Nav && item.MaterialPlant_Nav.SerialNumberProfile ? context.localizeText('yes') : context.localizeText('no');
    } else if (type === stockType) {
        commonFields.Batch = item.STOScheduleLine_Nav[0] && item.STOScheduleLine_Nav[0].Batch;
        commonFields.SupplyPlant = item.StockTransportOrderHeader_Nav.SupplyingPlant;
        commonFields.QuantityUOM = GetPurchaseOrderItemsOpenQuantitiesText(context, item, true);
        commonFields.StorageBin = GetStorageBin(context, item);
    } else if (type === inboundType || type === outboundType) {
        commonFields.ItemNum = item.Item;
        commonFields.PLantSLoc = getPlantSLoc(item.Plant, item.StorageLocation);
        commonFields.Material = item.Material;
        commonFields.MaterialDesc = GetMaterialName(context, item);
        commonFields.QuantityUOM = InboundOutboundDeliveryQuantity(context, item);
    } else if (type === productionItemType) {
        commonFields.ItemNum = item.ItemNum;
        commonFields.PLantSLoc = getPlantSLoc(item.PlanningPlant, '');
        commonFields.MaterialDesc = item.Material_Nav.Description;
        commonFields.Material = item.MaterialNum;
        commonFields.QuantityUOM = item.OrderQuantity + ' ' + item.OrderUOM;
        commonFields.StorageBin = GetStorageBin(context, item);
    } else if (type === productionCompType) {
        commonFields.MoveType = item.MovementType;
        commonFields.PLantSLoc = getPlantSLoc(item.SupplyPlant, item.SupplyStorageLocation);
        commonFields.Material = item.MaterialNum;
        commonFields.GLAccount = '';
        commonFields.MaterialDesc = GetMaterialName(context, item);
        commonFields.QuantityUOM = item.RequirementQuantity + ' ' + item.RequirementUOM;
    } else if (type === reservationType) {
        commonFields.MoveType = item.MovementType;
        commonFields.PLantSLoc = getPlantSLoc(item.SupplyPlant, item.SupplyStorageLocation);
        commonFields.GLAccount = item.GLAccount;
        commonFields.MaterialDesc = GetMaterialName(context, item);
        commonFields.QuantityUOM = GetPurchaseOrderItemsOpenQuantitiesText(context, item, true);

        if (movementTypes.includes(item.MovementType)) {
            commonFields.GLAccount = item.GLAccount;
        }

        if (item.MovementType === '261') {
            commonFields.WorkOrder = item.ReservationHeader_Nav.OrderId;
            commonFields.CostCenter = item.ReservationHeader_Nav.CostCenter;
        } else if (item.MovementType === '221') {
            commonFields.WBSElement = item.WBSElement;
        } else if (item.MovementType === '281') {
            commonFields.NetworkActivity = item.ReservationHeader_Nav.Network + '/' + '';
        } else if (item.MovementType === '201') {
            commonFields.CostCenter = item.ReservationHeader_Nav.CostCenter;
        }
    } else if (type === 'MaterialDocItem') {
        commonFields.ItemNum = item.MatDocItem;
        commonFields.PLantSLoc = getPlantSLoc(item.Plant, item.StorageLocation);
        commonFields.Material = item.Material;
        commonFields.MaterialDesc = GetMaterialDesc(context, item);
        commonFields.QuantityUOM = item.EntryQuantity + ' ' + item.EntryUOM;
        commonFields.MoveType = item.MovementType;
        commonFields.ValuationType = item.ValuationType;
        commonFields.FinalIssue = item.FinalIssue;
        commonFields.GoodsRecipient = item.GoodsRecipient;
        commonFields.UnloadingPoint = item.UnloadingPoint;
        commonFields.ItemText = item.ItemText;

        if (movementTypes.includes(item.MovementType)) {
            commonFields.GLAccount = item.GLAccount;
        }

        if (item.MovementType === '101') {
            commonFields.autoSerialNumbers = !!item.AutoGenerateSerialNumbers && context.localizeText('yes') || context.localizeText('no');
        } else if (item.MovementType === '301' || item.MovementType === '311') {
            commonFields.MovePlant = item.MovePlant;
            commonFields.MoveSloc = item.MoveStorageLocation;
            commonFields.MoveBatch = item.MoveBatch;
            commonFields.MoveValuationType = item.MoveValuationType;
        } else if (item.MovementType === '261') {
            commonFields.WorkOrder = item.OrderNumber;
            commonFields.CostCenter = item.CostCenter;
        } else if (item.MovementType === '221') {
            commonFields.WBSElement = item.WBSElement;
        } else if (item.MovementType === '281') {
            commonFields.NetworkActivity = item.Network + '/';
        } else if (item.MovementType === '201') {
            commonFields.CostCenter = item.CostCenter;
        } else if (item.MovementType === '501') {
            commonFields.MoveReason = item.MovementReason;
            commonFields.CostCenter = item.CostCenter;
        } else if (item.MovementType === '122') {
            commonFields.MoveReason = item.MovementReason;
        }
    }

    let plant = item.Plant || item.SupplyPlant || item.PlanningPlant || '-1';
    let material = commonFields.Material || '-1';
    let query = `$filter=Plant eq '${plant}' and MaterialNum eq '${material}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], query).then(async (data) => {
        if (data.length === 1) {
            let plantNav = data.getItem(0);
            if (plantNav.ValuationCategory && !plantNav.BatchIndicator && type === reservationType) {
                commonFields.ValuationType = commonFields.Batch;
                commonFields.Batch = '';
            }
            if (!commonFields.ValuationType && plantNav.ValuationCategory && context.binding) {
                commonFields.ValuationType = await GetValuationType(context);
            }
        }
        return commonFields;
    });
}

function getStockType(stockType) {
    if (stockType === 'S') {
        return 'stock_type_options_blocked';
    } else if (stockType === 'X') {
        return 'stock_type_options_inspection';
    } else {
        return 'stock_type_options_unrestricted';
    }
}

function getPlantSLoc(plant, sloc) {
    if (plant && sloc) {
        return plant + '/' + sloc;
    } else if (plant) {
        return plant;
    } else if (sloc) {
        return sloc;
    }

    return '';
}
