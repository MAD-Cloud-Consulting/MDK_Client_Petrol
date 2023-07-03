
export default function PhaseModelListViewQueryOptionExpand(entityType) {
    switch (entityType) {
        case 'ORI':
            return 'OrderMobileStatus_Nav,OrderMobileStatus_Nav/OverallStatusCfg_Nav';
        case 'QMI':
            return 'Effect_Nav,DetectionGroup_Nav,DetectionCode_Nav'; 
        case 'OVG':
            return 'OperationMobileStatus_Nav,OperationMobileStatus_Nav/OverallStatusCfg_Nav';
        default:
            break;
    }
    return '';
}

