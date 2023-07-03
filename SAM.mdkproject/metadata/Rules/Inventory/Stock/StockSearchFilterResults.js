import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function StockSearchFilterResults(context) {
    
    //Before applying new filters we will set the query options on the list view page to only filter by the user plant so that any new filters can be applied as an AND to the default query
    let pageProxy = context.evaluateTargetPathForAPI('#Page:StockListViewPage');
    let sectionedTable = pageProxy.getControls()[0];
    let offlineSection = sectionedTable.getSections()[0];
    let targetSpecifier = offlineSection.getTargetSpecifier();

    let query = '$expand=Material/MaterialPlants,MaterialPlant/MaterialBatch_Nav&$orderby=MaterialNum,Plant,StorageLocation';
    let userPlant = CommonLibrary.getUserDefaultPlant();
    
    if (userPlant) {
        query += `&$filter=Plant eq '${userPlant}'`;
    }

    targetSpecifier.setQueryOptions(query);
    offlineSection.setTargetSpecifier(targetSpecifier);
    
    let result1 = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:SortFilter/#Value');
    let result6 = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:IsTodaySwitch/#Value');
    let materialNumberFilter = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:MaterialNumberFilter');
    let PlantFilter = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:PlantFilter');
    let StorgaeLocationFilter = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:StorgaeLocationFilter');
    let StorageBinFilter = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:StorageBinFilter');

    let filterResults = [result1];
    let material = [];
    let plant = [];
    let storageLocation = [];
    let storageBin = [];
    if (materialNumberFilter.getValue().length > 0) {
        for (var i = 0; i < materialNumberFilter.getValue().length; i++) {
            material.push(materialNumberFilter.getValue()[i].ReturnValue);
        }
    }

    if (PlantFilter.getValue().length > 0) {
        for (var j = 0; j < PlantFilter.getValue().length; j++) {
            plant.push(PlantFilter.getValue()[j].ReturnValue);
        }
    }

    if (StorgaeLocationFilter.getValue().length > 0) {
        for (var k = 0; k < StorgaeLocationFilter.getValue().length; k++) {
            storageLocation.push(StorgaeLocationFilter.getValue()[k].ReturnValue);
        }
    }

    if (StorageBinFilter.getValue().length > 0) {
        for (var q = 0; q < StorageBinFilter.getValue().length; q++) {
            storageBin.push(StorageBinFilter.getValue()[q].ReturnValue);
        }
    }

    //We have to account for each combination of material, plant and sloc to generate the proper query
    if (material.length > 0 && plant.length > 0 && storageLocation.length > 0) {
        let materialQueryOptions = '(';
        for (var a = 0; a < storageLocation.length; a++) {
            for (var b = 0; b < plant.length; b++) {
                for (var c = 0; c < material.length; c++) {
                    if (a === 0 && c === 0 && b === 0) {
                        materialQueryOptions = materialQueryOptions + `MaterialNum eq '${material[c]}' and Plant eq '${plant[b]}' and StorageLocation eq '${storageLocation[a]}'`;
                    } else {
                        materialQueryOptions = materialQueryOptions + ` or MaterialNum eq '${material[c]}' and Plant eq '${plant[b]}' and StorageLocation eq '${storageLocation[a]}'`;
                    }
                }
            }
        }
        materialQueryOptions = materialQueryOptions + ')';

        let materialFilter = [materialQueryOptions];
        let materialFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, materialFilter, true);
        filterResults.push(materialFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = materialQueryOptions;
    } else if (plant.length > 0 && storageLocation.length > 0) {
        let plantAndSlocQueryOptions = '(';
        for (var d = 0; d < storageLocation.length; d++) {
            for (var e = 0; e < plant.length; e++) {
                if (d === 0 && e === 0) {
                    plantAndSlocQueryOptions = plantAndSlocQueryOptions + `Plant eq '${plant[e]}' and StorageLocation eq '${storageLocation[d]}'`;
                } else {
                    plantAndSlocQueryOptions = plantAndSlocQueryOptions + ` or Plant eq '${plant[e]}' and StorageLocation eq '${storageLocation[d]}'`;
                }
            }
        }
        plantAndSlocQueryOptions = plantAndSlocQueryOptions + ')';

        let plantSlocFilter = [plantAndSlocQueryOptions]; 
        let plantSlocFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, plantSlocFilter, true);
        filterResults.push(plantSlocFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = plantAndSlocQueryOptions;
    } else if (material.length > 0 && plant.length > 0) {
        let materialPlantQueryOptions = '(';
        for (let plantIndex = 0; plantIndex < plant.length; plantIndex++) {
            for (let materialIndex = 0; materialIndex < material.length; materialIndex++) {
                if (materialIndex === 0 && plantIndex === 0) {
                    materialPlantQueryOptions = materialPlantQueryOptions + `MaterialNum eq '${material[materialIndex]}' and Plant eq '${plant[plantIndex]}'`;
                } else {
                    materialPlantQueryOptions = materialPlantQueryOptions + ` or MaterialNum eq '${material[materialIndex]}' and Plant eq '${plant[plantIndex]}'`;
                }
            }
        }
        materialPlantQueryOptions = materialPlantQueryOptions + ')';
        let materialPlantFilter = [materialPlantQueryOptions];
        let materialPlantFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, materialPlantFilter, true);
        filterResults.push(materialPlantFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = materialPlantQueryOptions;
    } else if (material.length > 0 && storageLocation.length > 0) {
        let materialSlocQueryOptions = '(';
        for (let slockIndex = 0; slockIndex < storageLocation.length; slockIndex++) {
            for (let materialIndex = 0; materialIndex < material.length; materialIndex++) {
                if (slockIndex === 0 && materialIndex === 0) {
                    materialSlocQueryOptions = materialSlocQueryOptions + `MaterialNum eq '${material[materialIndex]}' and StorageLocation eq '${storageLocation[slockIndex]}'`;
                } else {
                    materialSlocQueryOptions = materialSlocQueryOptions + ` or MaterialNum eq '${material[materialIndex]}' and StorageLocation eq '${storageLocation[slockIndex]}'`;
                }
            }
        }
        materialSlocQueryOptions = materialSlocQueryOptions + ')';

        let materialSlocFilter = [materialSlocQueryOptions];
        let materialSlocFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, materialSlocFilter, true);
        filterResults.push(materialSlocFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = materialSlocQueryOptions;
    } else if (plant.length > 0) {
        let plantQueryOptions = '(';
        for (var f = 0; f < plant.length; f++) {
            if (f === 0) {
                plantQueryOptions = plantQueryOptions + `Plant eq '${plant[f]}'`;
            } else {
                plantQueryOptions = plantQueryOptions + ` or Plant eq '${plant[f]}'`;
            }
        }
        plantQueryOptions = plantQueryOptions + ')';

        let plantFilter = [plantQueryOptions];
        let plantFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, plantFilter, true);
        filterResults.push(plantFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = plantQueryOptions;
    } else if (storageLocation.length > 0) {
        let slocQueryOptions = '(';
        for (var g = 0; g < storageLocation.length; g++) {
            if (g === 0) {
                slocQueryOptions = slocQueryOptions + `StorageLocation eq '${storageLocation[g]}'`;
            } else {
                slocQueryOptions = slocQueryOptions + ` or StorageLocation eq '${storageLocation[g]}'`;
            }
        }
        slocQueryOptions = slocQueryOptions + ')';

        let slocFilter = [slocQueryOptions];
        let slocFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, slocFilter, true);
        filterResults.push(slocFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = slocQueryOptions;
    } else if (material.length > 0) {
        let materialsQueryOptions = '(';
        for (var h = 0; h < material.length; h++) {
            if (h === 0) {
                materialsQueryOptions = materialsQueryOptions + `MaterialNum eq '${material[h]}'`;
            } else {
                materialsQueryOptions = materialsQueryOptions + ` or MaterialNum eq '${material[h]}'`;
            }
        }
        materialsQueryOptions = materialsQueryOptions + ')';
        let materialFilter = [materialsQueryOptions];
        let materialFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, materialFilter, true);
        filterResults.push(materialFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = materialsQueryOptions;
    } else if (storageBin.length > 0) {
        let storageBinQueryOptions = '(';
        for (var r = 0; r < storageBin.length; r++) {
            if (r === 0) {
                storageBinQueryOptions = storageBinQueryOptions + `StorageBin eq '${storageBin[r]}'`;
            } else {
                storageBinQueryOptions = storageBinQueryOptions + ` or StorageBin eq '${storageBin[r]}'`;
            }
        }
        storageBinQueryOptions = storageBinQueryOptions + ')';
        let storageBinFilter = [storageBinQueryOptions];
        let storageBinFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, storageBinFilter, true);
        filterResults.push(storageBinFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = storageBinQueryOptions;
    }

    let clientData = context.evaluateTargetPath('#Page:StockListViewPage/#ClientData');
    clientData.isForToday = false;
    if (result6) {
        let filter = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [clientData.todayMaterialsFilter], true);
        filterResults.push(filter);

        clientData.isForToday = true;
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = clientData.todayMaterialsFilter;
    }

    return filterResults;
}
