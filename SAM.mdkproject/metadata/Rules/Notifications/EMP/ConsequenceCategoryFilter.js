export default function ConsequenceCategoryFilter(context) {

    // eslint-disable-next-line brace-style
    let equipment = (function() {try { return context.getPageProxy().evaluateTargetPath('#Page:NotificationAddPage/#Control:EquipHierarchyExtensionControl/#Value'); } catch (exc) { return ''; } })();
    // eslint-disable-next-line brace-style
    let floc = (function() {try { return context.getPageProxy().evaluateTargetPath('#Page:NotificationAddPage/#Control:FuncLocHierarchyExtensionControl/#Value'); } catch (exc) { return ''; } })();
    // eslint-disable-next-line brace-style
    let type = (function() {try { return context.getPageProxy().evaluateTargetPath('#Page:NotificationAddPage/#Control:TypeLstPkr/#SelectedValue'); } catch (exc) { return ''; } })();

    // eslint-disable-next-line brace-style
    let equipRead = context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${equipment}')`, [], '$select=MaintPlant').then(result => {return result.getItem(0).MaintPlant;}).catch(() => {return '';});
    // eslint-disable-next-line brace-style
    let flocRead = context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${floc}')`, [], '$select=MaintPlant').then(result => {return result.getItem(0).MaintPlant;}).catch(() => {return '';});
    return Promise.all([equipRead, flocRead]).then(plants => {
        let plant = plants[0] || plants[1] || '';
        if (plant) {
            return `$filter=ConsequenceGroup_Nav/PrioritizationProfile_Nav/PrioritizationProfileLink_Nav/any(ppl:ppl/NotificationType eq '${type}' and ppl/Plant eq '${plant}')`;
        } else {
            return '$filter=false';
        }
    });
}
