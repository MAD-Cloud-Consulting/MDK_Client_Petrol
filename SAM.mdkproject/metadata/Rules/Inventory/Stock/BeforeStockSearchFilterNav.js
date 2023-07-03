import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

export default function BeforeStockSearchFilterNav(context) {
    let clientData = context.evaluateTargetPath('#Page:StockListViewPage/#ClientData');

    const today = new Date(new Date().setHours(0,0,0,0));

    return libWO.dateOrdersFilter(context, today, 'ScheduledStartDate').then(dateFilter => {
        let query = `$filter=${dateFilter}&$expand=Components/Material`;

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], query).then(orders => {
            let materials = [];

            if (orders.length > 0) {
                for (let i=0; i < orders.length; i++) {
                    let orderRecord = orders.getItem(i);
                    let orderComponents = orderRecord.Components;

                    if (orderComponents && orderComponents.length) {
                        for (let j=0; j < orderComponents.length; j++) {
                            let orderComponent = orderComponents[j];
                            if (orderComponent && orderComponent.Material) {
                                materials.push(`MaterialNum eq '${orderComponent.Material.MaterialNum}'`);
                            } else if (orderComponent && orderComponent.MaterialNum) {
                                materials.push(`MaterialNum eq '${orderComponent.MaterialNum}'`);
                            }
                        }
                    }
                }
            }

            if (materials.length > 0) {
                var uniqueArray = [...new Set(materials)];
                clientData.todayMaterialsFilter = `(${uniqueArray.join(' or ')})`;
            } else {
                clientData.todayMaterialsFilter = '(MaterialNum eq \'\')';
            }

            return context.executeAction('/SAPAssetManager/Actions/Inventory/Stock/StockSearchFilter.action');
        });
    });
}
