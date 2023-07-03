export default function GetMaterialBinBatchPISerialScreen(context) {
    const target = context.binding;
    let type;
    let material = '';
    let batch = '';
    let bin = '';

    if (target) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        material = target.MaterialNum || target.Material || '';
        batch = '';
        bin = '';
      
        //Counting a PI Item from PI details page
        batch = target.Batch;
        bin = target.MaterialSLoc_Nav && target.MaterialSLoc_Nav.StorageBin;
    }

    if (type === 'PhysicalInventoryDocHeader' || !target) { //Adding new item to a local PI header, either from overview (no binding) or from PI details
        let page;
        try {
            page = context.evaluateTargetPathForAPI('#Page:PhysicalInventoryItemCreateUpdatePage');
        } catch (err) {
            //page does not exist
        }
        if (!page) {
            try {
                page = context.evaluateTargetPathForAPI('#Page:PhysicalInventoryCreateUpdatePage');
            } catch (err) {
                //page does not exist
            }
        }
        if (page) {
            material = page.getControl('FormCellContainer').getControl('MatrialListPicker').getValue()[0].ReturnValue;
            bin = page.getControl('FormCellContainer').getControl('StorageBinSimple').getValue();
            batch = page.getControl('FormCellContainer').getControl('BatchSimple').getValue();
        }
    }

    if (material && bin && batch) {
        return material + '/' + bin + '/' + batch;
    } else if (material && batch) {
        return material + '/' + batch;
    } else if (material && bin) {
        return material + '/' + bin;
    } else if (material) {
        return material;
    }
}
