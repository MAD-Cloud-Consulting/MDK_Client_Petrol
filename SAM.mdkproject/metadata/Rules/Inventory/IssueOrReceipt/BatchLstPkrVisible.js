/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function BatchLstPkrVisible(context) {
    if (context.binding && context.binding.BatchIndicator === 'X') {
        if (context.binding.MaterialPlant.MaterialBatch_Nav.length) {
            return true;
        } else {
            let batchSimple = context.getPageProxy().evaluateTargetPathForAPI('#Control:BatchSimple');
            batchSimple.setVisible(true);
            return false;
        }
    } else {
        return false;
    }
}
