import libSuper from '../Supervisor/SupervisorLibrary';

export default function WorkOrderOperationMobileStatusFilter(context) {

    if (libSuper.isSupervisorFeatureEnabled(context)) {
        return { name: 'OperationMobileStatus_Nav/MobileStatus', 
                values: [{ReturnValue: 'RECEIVED', DisplayValue: context.localizeText('received')},
                {ReturnValue: 'STARTED', DisplayValue: context.localizeText('started')},
                {ReturnValue: 'HOLD', DisplayValue: context.localizeText('hold')},
                {ReturnValue: 'TRANSFER', DisplayValue: context.localizeText('transfer')},
                {ReturnValue: 'COMPLETED', DisplayValue: context.localizeText('completed')},
                {ReturnValue: 'TRAVEL', DisplayValue: context.localizeText('enroute')},
                {ReturnValue: 'ONSITE', DisplayValue: context.localizeText('onsite')},
                {ReturnValue: 'REVIEW', DisplayValue: context.localizeText('REVIEW')},
                {ReturnValue: 'REJECTED', DisplayValue: context.localizeText('REJECTED')}],
                };
    }
    return { name: 'OperationMobileStatus_Nav/MobileStatus', 
            values: [{ReturnValue: 'RECEIVED', DisplayValue: context.localizeText('received')},
            {ReturnValue: 'STARTED', DisplayValue: context.localizeText('started')},
            {ReturnValue: 'HOLD', DisplayValue: context.localizeText('hold')},
            {ReturnValue: 'TRANSFER', DisplayValue: context.localizeText('transfer')},
            {ReturnValue: 'COMPLETED', DisplayValue: context.localizeText('completed')},
            {ReturnValue: 'TRAVEL', DisplayValue: context.localizeText('enroute')},
            {ReturnValue: 'ONSITE', DisplayValue: context.localizeText('onsite')},
            {ReturnValue: 'REJECTED', DisplayValue: context.localizeText('REJECTED')}],
            };
}
