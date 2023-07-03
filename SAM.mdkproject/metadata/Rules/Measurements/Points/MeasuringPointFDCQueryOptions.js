import libCommon from '../../Common/Library/CommonLibrary';

function roundsQueryOptions(context) {
    let binding = context.getPageProxy().binding;
    if (!binding || binding.constructor.name !== 'Object') {
        binding = context.binding;
    }
    let MeasuringPointData = {};

    /* Query options are in the following order:
     * 1. Expand
     *    a. Equipment Measuring Points
     *    b. FLOC Measuring Points
     *
     *    c. Operation Equipment Measuring Points
     *    d. Operation FLOC Measuring Points
     *
     *    e. Sub Operation Equipment Measuring Points
     *    f. Sub Operation FLOC Measuring Points
     *  2. Select
     *    a. Equipment Measuring Points - Point Number
     *    b. FLOC Measuring Points - Point Number
     *
     *    c. Operation Equipment Measuring Points - Point Number
     *    d. Operation FLOC Measuring Points - Point Number
     *
     *    e. Sub Operation Equipment Measuring Points - Point Number
     *    f. Sub Operation FLOC Measuring Points - Point Number
     *
     *    g. Operation ObjectKey
     *    h. Sub-Operation ObjectKey
     *
     *  Equipment/FLOC associated Work Order and Operation is stored on Client Data
     */
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],
        '$expand=Equipment/MeasuringPoints,FunctionalLocation/MeasuringPoints,' +
        'Operations/EquipmentOperation/MeasuringPoints,Operations/FunctionalLocationOperation/MeasuringPoints,' +
        'Operations/Tools,'+
        'Operations/NotifHeader_Nav/FunctionalLocation/MeasuringPoints,' +
        'Operations/NotifHeader_Nav/Equipment/MeasuringPoints,' +
        'Operations/WOObjectList_Nav/FuncLoc_Nav/MeasuringPoints,' +
        'Operations/WOObjectList_Nav/Equipment_Nav/MeasuringPoints,' +
        'Operations/SubOperations/EquipmentSubOperation/MeasuringPoints,Operations/SubOperations/FunctionalLocationSubOperation/MeasuringPoints&' +
        '$select=Equipment/EquipId,Equipment/MeasuringPoints/Point,FunctionalLocation/FuncLocIdIntern,FunctionalLocation/MeasuringPoints/Point,' +
        'Operations/EquipmentOperation/MeasuringPoints/Point,Operations/FunctionalLocationOperation/MeasuringPoints/Point,' +
        'Operations/SubOperations/EquipmentSubOperation/MeasuringPoints/Point,Operations/SubOperations/FunctionalLocationSubOperation/MeasuringPoints/Point,' +
        'Operations/ObjectKey,Operations/SubOperations/ObjectKey,Operations/OperationNo,Operations/SubOperations/OperationNo,Operations/OperationShortText,Operations/SubOperations/OperationShortText,Operations/Tools/PRTCategory,' +
        'Operations/SubOperations/SubOperationNo'
        ).then(function(result) {
            if (result && result.length > 0) {
                let out = [];
                let results = result.getItem(0);
                var tempOperation;

                // Top-level Equipment?
                if (results.Equipment) {
                    for (let pt in results.Equipment.MeasuringPoints) {
                        out.push(`Point eq '${results.Equipment.MeasuringPoints[pt].Point}'`);
                        MeasuringPointData[results.Equipment.MeasuringPoints[pt].Point] = {'OrderId' : binding.ObjectKey, 'Operation': ''};
                    }
                }
                // Top-level FLOC?
                if (results.FunctionalLocation) {
                    for (let pt in results.FunctionalLocation.MeasuringPoints) {
                        out.push(`Point eq '${results.FunctionalLocation.MeasuringPoints[pt].Point}'`);
                        MeasuringPointData[results.FunctionalLocation.MeasuringPoints[pt].Point] = {'OrderId' : binding.ObjectKey, 'Operation': ''};
                    }
                }
                // Operations
                for (let op in results.Operations) {
                    // Operation Equipment?
                    if (results.Operations[op].EquipmentOperation) {
                        for (let pt in results.Operations[op].EquipmentOperation.MeasuringPoints) {
                            out.push(`Point eq '${results.Operations[op].EquipmentOperation.MeasuringPoints[pt].Point}'`);
                            tempOperation = results.Operations[op].OperationNo;
                            let item = results.Operations[op].EquipmentOperation.MeasuringPoints[pt].Point;
                            if (MeasuringPointData.hasOwnProperty(item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                                tempOperation = FormatOperations(tempOperation,MeasuringPointData[item].OperationNo);
                            } else {
                                tempOperation = '|' + tempOperation + '|';
                            }
                            MeasuringPointData[results.Operations[op].EquipmentOperation.MeasuringPoints[pt].Point] = {'OrderId' : binding.ObjectKey, 'Operation': results.Operations[op].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].OperationShortText, 'Operations/Tools/PRTCategory':results.Operations[op].Tools.PRTCategory};
                        }
                    }
                    // Operation FLOC?
                    if (results.Operations[op].FunctionalLocationOperation) {
                        for (let pt in results.Operations[op].FunctionalLocationOperation.MeasuringPoints) {
                            out.push(`Point eq '${results.Operations[op].FunctionalLocationOperation.MeasuringPoints[pt].Point}'`);
                            tempOperation = results.Operations[op].OperationNo;
                            let item = results.Operations[op].FunctionalLocationOperation.MeasuringPoints[pt].Point;
                            if (MeasuringPointData.hasOwnProperty(item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                                tempOperation = FormatOperations(tempOperation,MeasuringPointData[item].OperationNo);
                            } else {
                                tempOperation = '|' + tempOperation + '|';
                            }
                            MeasuringPointData[results.Operations[op].FunctionalLocationOperation.MeasuringPoints[pt].Point] = {'OrderId' : binding.ObjectKey, 'Operation': results.Operations[op].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].OperationShortText};
                        }
                    }

                    // Operation's notification equipment
                    if (results.Operations[op].NotifHeader_Nav && results.Operations[op].NotifHeader_Nav.Equipment) {
                        for (let pt in results.Operations[op].NotifHeader_Nav.Equipment.MeasuringPoints) {
                            out.push(`Point eq '${results.Operations[op].NotifHeader_Nav.Equipment.MeasuringPoints[pt].Point}'`);
                            tempOperation = results.Operations[op].OperationNo;
                            let item = results.Operations[op].NotifHeader_Nav.Equipment.MeasuringPoints[pt].Point;
                            if (MeasuringPointData.hasOwnProperty(item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                                tempOperation = FormatOperations(tempOperation,MeasuringPointData[item].OperationNo);
                            } else {
                                tempOperation = '|' + tempOperation + '|';
                            }
                            MeasuringPointData[results.Operations[op].NotifHeader_Nav.Equipment.MeasuringPoints[pt].Point] = {'OrderId' : binding.ObjectKey, 'Operation': results.Operations[op].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].OperationShortText, 'Operations/Tools/PRTCategory':results.Operations[op].Tools.PRTCategory};
                        }
                    }

                    // Operation's notification FLOC
                    if (results.Operations[op].NotifHeader_Nav && results.Operations[op].NotifHeader_Nav.FunctionalLocation) {
                        for (let pt in results.Operations[op].NotifHeader_Nav.FunctionalLocation.MeasuringPoints) {
                            out.push(`Point eq '${results.Operations[op].NotifHeader_Nav.FunctionalLocation.MeasuringPoints[pt].Point}'`);
                            tempOperation = results.Operations[op].OperationNo;
                            let item = results.Operations[op].NotifHeader_Nav.FunctionalLocation.MeasuringPoints[pt].Point;
                            if (MeasuringPointData.hasOwnProperty(item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                                tempOperation = FormatOperations(tempOperation,MeasuringPointData[item].OperationNo);
                            } else {
                                tempOperation = '|' + tempOperation + '|';
                            }
                            MeasuringPointData[results.Operations[op].NotifHeader_Nav.FunctionalLocation.MeasuringPoints[pt].Point] = {'OrderId' : binding.ObjectKey, 'Operation': results.Operations[op].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].OperationShortText, 'Operations/Tools/PRTCategory':results.Operations[op].Tools.PRTCategory};
                        }
                    }

                    // Operation's objectlist equipment & FLOC
                    if (results.Operations[op].WOObjectList_Nav && results.Operations[op].WOObjectList_Nav.length > 0) {
                        for (let obj in results.Operations[op].WOObjectList_Nav) {
                            // objectlist equipment
                            if (results.Operations[op].WOObjectList_Nav[obj].Equipment_Nav) {
                                for (var _pt6 in results.Operations[op].WOObjectList_Nav[obj].Equipment_Nav.MeasuringPoints) {
                                  out.push('Point eq \'' + results.Operations[op].WOObjectList_Nav[obj].Equipment_Nav.MeasuringPoints[_pt6].Point + '\'');
                                  tempOperation = results.Operations[op].OperationNo;
                                  var _item4 = results.Operations[op].WOObjectList_Nav[obj].Equipment_Nav.MeasuringPoints[_pt6].Point;
                                  if (MeasuringPointData.hasOwnProperty(_item4) && MeasuringPointData[_item4].OperationNo) {
                                      //Multiple operations use this point
                                      tempOperation = FormatOperations(tempOperation, MeasuringPointData[_item4].OperationNo);
                                  } else {
                                      tempOperation = '|' + tempOperation + '|';
                                  }
                                  MeasuringPointData[results.Operations[op].WOObjectList_Nav[obj].Equipment_Nav.MeasuringPoints[_pt6].Point] = { 'OrderId': binding.ObjectKey, 'Operation': results.Operations[op].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].OperationShortText, 'Operations/Tools/PRTCategory': results.Operations[op].Tools.PRTCategory };
                                }
                            }
                            // objectlist FLOC
                            if (results.Operations[op].WOObjectList_Nav[obj].FuncLoc_Nav) {
                                for (var _pt7 in results.Operations[op].WOObjectList_Nav[obj].FuncLoc_Nav.MeasuringPoints) {
                                    out.push('Point eq \'' + results.Operations[op].WOObjectList_Nav[obj].FuncLoc_Nav.MeasuringPoints[_pt7].Point + '\'');
                                    tempOperation = results.Operations[op].OperationNo;
                                    var _item5 = results.Operations[op].WOObjectList_Nav[obj].FuncLoc_Nav.MeasuringPoints[_pt7].Point;
                                    if (MeasuringPointData.hasOwnProperty(_item5) && MeasuringPointData[_item5].OperationNo) {
                                        //Multiple operations use this point
                                        tempOperation = FormatOperations(tempOperation, MeasuringPointData[_item5].OperationNo);
                                    } else {
                                        tempOperation = '|' + tempOperation + '|';
                                    }
                                    MeasuringPointData[results.Operations[op].WOObjectList_Nav[obj].FuncLoc_Nav.MeasuringPoints[_pt7].Point] = { 'OrderId': binding.ObjectKey, 'Operation': results.Operations[op].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].OperationShortText, 'Operations/Tools/PRTCategory': results.Operations[op].Tools.PRTCategory };
                                }
                            }
                        }
                    }

                    // Suboperations
                    for (let sop in results.Operations[op].SubOperations) {
                        // Suboperation Equipment?
                        if (results.Operations[op].SubOperations[sop].EquipmentSubOperation) {
                            for (let pt in results.Operations[op].SubOperations[sop].EquipmentSubOperation.MeasuringPoints) {
                                out.push(`Point eq '${results.Operations[op].SubOperations[sop].EquipmentSubOperation.MeasuringPoints[pt].Point}'`);
                                tempOperation = results.Operations[op].SubOperations[sop].OperationNo + '-' + results.Operations[op].SubOperations[sop].SubOperationNo;
                                let item = results.Operations[op].SubOperations[sop].EquipmentSubOperation.MeasuringPoints[pt].Point;
                                if (MeasuringPointData.hasOwnProperty(item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                                    tempOperation = FormatOperations(tempOperation,MeasuringPointData[item].OperationNo);
                                } else {
                                    tempOperation = '|' + tempOperation + '|';
                                }
                                MeasuringPointData[results.Operations[op].SubOperations[sop].EquipmentSubOperation.MeasuringPoints[pt].Point] = {'OrderId' : binding.ObjectKey, 'Operation': results.Operations[op].SubOperations[sop].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].SubOperations[sop].OperationShortText};
                            }
                        }
                        // Suboperation FLOC?
                        if (results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation) {
                            for (let pt in results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation.MeasuringPoints) {
                                out.push(`Point eq '${results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation.MeasuringPoints[pt].Point}'`);
                                tempOperation = results.Operations[op].SubOperations[sop].OperationNo + '-' + results.Operations[op].SubOperations[sop].SubOperationNo;
                                let item = results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation.MeasuringPoints[pt].Point;
                                if (MeasuringPointData.hasOwnProperty(item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                                    tempOperation = FormatOperations(tempOperation,MeasuringPointData[item].OperationNo);
                                } else {
                                    tempOperation = '|' + tempOperation + '|';
                                }
                                MeasuringPointData[results.Operations[op].SubOperations[sop].FunctionalLocationSubOperation.MeasuringPoints[pt].Point] = {'OrderId' : binding.ObjectKey, 'Operation': results.Operations[op].SubOperations[sop].ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': results.Operations[op].SubOperations[sop].OperationShortText};
                            }
                        }
                    }
                }

                //Final formatting of the operations string
                for (var pointKey in MeasuringPointData) {
                    let point = MeasuringPointData[pointKey];
                    let op = point.OperationNo;
                    let opArray;
                    if (op) {
                        op.replace('||','|');
                        opArray = op.split('|');
                        opArray.sort(); //Order the operations
                        point.OperationNo = '';
                        opArray.forEach(function(newOp) {
                            if (newOp) {
                                point.OperationNo += ', ' + newOp;
                            }
                        });
                        point.OperationNo = point.OperationNo.substring(2);
                    }
                }

                if (out && out.length > 0) {
                    context.getPageProxy().getClientData().MeasuringPointData = MeasuringPointData;
                    return '$filter=' + out.join(' or ') + '&$expand=WorkOrderTool,FunctionalLocation,Equipment,MeasurementDocs&$orderby=FunctionalLocation/FuncLocId,EquipId,SortField';
                } else {
                    return '';
                }
            }
            return '';
        });
}

//Concatenate the operations together used on each point
function FormatOperations(newOperation, finalList) {
    let list = '';
    if (finalList) {
        list = finalList;
    }
    if (newOperation) {
        if (list.indexOf('|' + newOperation + '|') === -1) {
            list += '|' + newOperation + '|';
        }
    }
    return list;
}

export default function MeasuringPointFDCQueryOptions(context) {
    let binding = context.getPageProxy().binding;
    if (!binding || binding.constructor.name !== 'Object') {
        binding = context.binding;
    }
    if (libCommon.isDefined(binding)) {
        let odataType = binding['@odata.type'];
        let operation = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue();
        let equipment = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue();
        let floc = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue();
        let workorder = '#sap_mobile.MyWorkOrderHeader';
        switch (odataType) {
            case workorder:
                return roundsQueryOptions(context);
            case operation:
                return "$filter=(PRTCategory eq 'P')&$expand=PRTPoint/MeasurementDocs,PRTPoint/MeasurementDocs/MeasuringPoint,PRTPoint/Equipment,PRTPoint/FunctionalLocation,WOOperation_Nav,WOOperation_Nav/WOHeader&$orderby=ItemNum&$select=PRTPoint/Point,PRTPoint/PointDesc,PRTPoint/UoM,PRTPoint/RangeUOM," +
                    'PRTPoint/CounterOverflow,PRTPoint/IsCounter,PRTPoint/CodeGroup,PRTPoint/CatalogType,PRTPoint/IsReverse,PRTPoint/IsLowerRange,PRTPoint/IsLowerRange,PRTPoint/IsUpperRange,PRTPoint/IsCodeSufficient,PRTPoint/LowerRange,PRTPoint/UpperRange,PRTPoint/Decimal,PRTPoint/CharName,PRTPoint/IsCounterOverflow,PRTPoint/LowerRange,PRTPoint/UpperRange,'+
                    'PRTPoint/EquipId,PRTPoint/Equipment/EquipDesc,'+
                    'PRTPoint/FuncLocIdIntern,PRTPoint/FunctionalLocation/FuncLocId,PRTPoint/FunctionalLocation/FuncLocDesc,' +
                    'PRTPoint/MeasurementDocs/ReadingDate,PRTPoint/MeasurementDocs/ReadingTime,PRTPoint/MeasurementDocs/CodeGroup,PRTPoint/MeasurementDocs/ValuationCode,PRTPoint/MeasurementDocs/CodeShortText,PRTPoint/MeasurementDocs/ReadingValue,PRTPoint/MeasurementDocs/IsCounterReading,PRTPoint/MeasurementDocs/IsCounterReading,PRTPoint/MeasurementDocs/CounterReadingDifference,PRTPoint/MeasurementDocs/MeasurementDocNum,PRTPoint/MeasurementDocs/MeasuringPoint/CharName,PRTPoint/MeasurementDocs/MeasuringPoint/IsCounter' +
                    ',WOOperation_Nav/OperationShortText,WOOperation_Nav/OperationNo' +
                    ',WOOperation_Nav/ObjectKey,WOOperation_Nav/WOHeader/ObjectKey';
            case equipment:
                return '$expand=MeasurementDocs&$orderby=SortField';
            case floc:
                return '$expand=FunctionalLocation,MeasurementDocs&$orderby=SortField';
            default:
                return '';
        }
    }
}
