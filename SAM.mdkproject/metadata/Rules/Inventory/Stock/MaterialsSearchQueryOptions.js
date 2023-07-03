import libCom from '../../Common/Library/CommonLibrary';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function MaterialsSearchQueryOptions(context) {
    let searchString = context.searchString;

    let userPlant = libCom.getUserDefaultPlant();
    let userStorage = libCom.getUserDefaultStorageLocation();
    let query = '$expand=Material/MaterialPlants,MaterialPlant/MaterialBatch_Nav&$orderby=MaterialNum,Plant,StorageLocation';
    let queryFilter = '';
    if (EnableFieldServiceTechnician(context)) {
        queryFilter = `Plant eq '${userPlant}' and StorageLocation eq '${userStorage}'`;
        query += '&$filter=' + queryFilter;
    }
    if (searchString) {
        let queryBuilder = context.dataQueryBuilder();
        let filters = [];
        let filter = '';

        filters.push(`substringof('${searchString.toLowerCase()}', tolower(MaterialNum))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(Plant))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(StorageLocation))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(Material/Description))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(StorageBin))`);
        
        filter = queryFilter 
         ? (queryFilter + ' and '+ '(' + filters.join(' or ') + ')') 
         : ('(' + filters.join(' or ') + ')');
        queryBuilder.filter(filter);
        queryBuilder.expand('Material/MaterialPlants,MaterialPlant/MaterialBatch_Nav');
        queryBuilder.orderBy('Plant asc','StorageLocation asc');

        return queryBuilder;
    }

    return query;
}
