import libCom from '../../../Common/Library/CommonLibrary';
import NotificationActivityGroupQuery from '../../Activity/NotificationActivityGroupQuery';
import NotificationTaskGroupQuery from '../../Task/NotificationTaskGroupQuery';
import NotificationItemActivityGroupQuery from '../Activity/Details/NotificationItemActivityGroupQuery';
import NotificationItemCauseGroupQuery from '../Cause/NotificationItemCauseGroupQuery';
import NotificationItemDamageGroupQuery from '../NotificationItemDamageGroupQuery';
import NotificationItemPartGroupQuery from '../NotificationItemPartGroupQuery';
import NotificationItemTaskGroupQuery from '../Task/NotificationItemTaskGroupQuery';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function NotificationItemPartGroupPickerItems(controlProxy) {
    let pageProxy = controlProxy.getPageProxy();
    let { queryOptionsRule, catType } = getOptionsForControl(controlProxy);
    
    return queryOptionsRule(pageProxy).then(queryOptions => {
        const usePMCatalogCodes = !libCom.getStateVariable(pageProxy, `IsAssignedToCatalogProfile[${catType}]`);
        let entitySet = 'PMCatalogProfiles';
        let displayValue = 'Description';
        let returnValue = 'CodeGroup';

        if (usePMCatalogCodes) {
            entitySet = 'PMCatalogCodes';
            displayValue = 'CodeGroupDesc';
        }

        return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(entries => {
            let options = [];
            let groupCodes = [];

            if (libCom.isDefined(entries)) {
                for (let i = 0; i < entries.length; i++) {
                    let item = entries.getItem(i);
                    if (usePMCatalogCodes) {
                        if (!groupCodes.includes(item[returnValue])) {
                            options.push({ 'DisplayValue': `${item[returnValue]} - ${item[displayValue]}` || '-', 'ReturnValue': item[returnValue] });
                            groupCodes.push(item[returnValue]);
                        }   
                    } else {
                        options.push({ 'DisplayValue': `${item[returnValue]} - ${item[displayValue]}` || '-', 'ReturnValue': item[returnValue] });
                    }
                }
                return options;
            }

            return options;
        });
    });
}

function getOptionsForControl(controlProxy) {
    const controlName = controlProxy.getName();
    const pageName = libCom.getPageName(controlProxy);
    let queryOptionsRule = Promise.resolve();
    let catType;

    switch (pageName) {
        case 'NotificationActivityAddPage':
            queryOptionsRule = NotificationActivityGroupQuery;
            catType = 'CatTypeActivities';
            break;
        case 'NotificationItemActivityAddPage':
            queryOptionsRule = NotificationItemActivityGroupQuery;
            catType = 'CatTypeActivities';
            break;
        case 'NotificationTaskAddPage':
            queryOptionsRule = NotificationTaskGroupQuery;
            catType = 'CatTypeTasks';
            break;
        case 'NotificationItemTaskAddPage':
            queryOptionsRule = NotificationItemTaskGroupQuery;
            catType = 'CatTypeTasks';
            break;
        case 'NotificationItemCauseAddPage':
            queryOptionsRule = NotificationItemCauseGroupQuery;
            catType = 'CatTypeCauses';
            break;
        case 'NotificationUpdateMalfunctionEnd':
        case 'NotificationAddPage':
        case 'NotificationItemAddPage':
            if (controlName === 'PartGroupLstPkr') {
                queryOptionsRule = NotificationItemPartGroupQuery;
                catType = 'CatTypeObjectParts';
            } else if (controlName === 'DamageGroupLstPkr') {
                queryOptionsRule = NotificationItemDamageGroupQuery;
                catType = 'CatTypeDefects';
            } else if (controlName === 'CauseGroupLstPkr') {
                queryOptionsRule = NotificationItemCauseGroupQuery;
                catType = 'CatTypeCauses';
            }
            break;
        default:
            break;
    }

    return { queryOptionsRule, catType };
}
