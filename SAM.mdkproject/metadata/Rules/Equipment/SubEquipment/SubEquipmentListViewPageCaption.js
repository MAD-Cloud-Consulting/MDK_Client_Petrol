import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import SubEquipmentCount from './SubEquipmentCount';

function setSubEquipmentListViewPageCaption(clientAPI) {
    SubEquipmentCount(clientAPI).then(setCaption.bind(null, clientAPI));
}

export default setSubEquipmentListViewPageCaption;

function getQueryOption(clientAPI) {
    var queryOption = '';
    if (!ValidationLibrary.evalIsEmpty(clientAPI.actionResults.filterResult)) {
        queryOption = clientAPI.actionResults.filterResult.data.filter;
    }
    return queryOption;
}

function setCaption(clientAPI, totalCount) {
    var queryOption = getQueryOption(clientAPI);
    if (
        !ValidationLibrary.evalIsEmpty(queryOption) &&
        queryOption.includes('$filter=') &&
        !ValidationLibrary.evalIsEmpty(queryOption.replace('$filter=', ''))
    ) {
        setCaptionIfIsQueryOption(clientAPI, totalCount, queryOption);
    } else {
        setCaptionWithOnlyTotalCount(clientAPI, totalCount);
    }
}

function setCaptionIfIsQueryOption(clientAPI, totalCount, queryOption) {
    var equipId = clientAPI.binding.EquipId;

    queryOption = queryOption + `and SuperiorEquip eq '${equipId}'`;
    clientAPI
        .count(
            '/SAPAssetManager/Services/AssetManager.service',
            'MyEquipments',
            queryOption
        )
        .then((filteredCount) => {
            if (filteredCount === totalCount) {
                setCaptionWithOnlyTotalCount(clientAPI, totalCount);
            } else {
                setCaptionWithFilteredCount(
                    clientAPI,
                    filteredCount,
                    totalCount
                );
            }
        });
}

function setCaptionWithFilteredCount(clientAPI, filteredCount, totalCount) {
    clientAPI.setCaption(
        clientAPI.localizeText('equipment_x_x', [
            clientAPI.formatNumber(filteredCount),
            clientAPI.formatNumber(totalCount),
        ])
    );
}

function setCaptionWithOnlyTotalCount(clientAPI, totalCount) {
    clientAPI.setCaption(
        clientAPI.localizeText('equipment_x', [
            clientAPI.formatNumber(totalCount),
        ])
    );
}
