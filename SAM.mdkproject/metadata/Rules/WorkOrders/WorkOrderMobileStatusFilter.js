import libSuper from '../Supervisor/SupervisorLibrary';

export default function WorkOrderMobileStatusFilter(context) {
    
    if (libSuper.isSupervisorFeatureEnabled(context)) {
        return { name: 'OrderMobileStatus_Nav/MobileStatus',
                 values: [{ReturnValue: 'RECEIVED', DisplayValue: context.localizeText('received')},
                 {ReturnValue: 'STARTED', DisplayValue: context.localizeText('started')},
                 {ReturnValue: 'HOLD', DisplayValue: context.localizeText('hold')},
                 {ReturnValue: 'TRANSFER', DisplayValue: context.localizeText('transferred')},
                 {ReturnValue: 'COMPLETED', DisplayValue: context.localizeText('completed')},
                 {ReturnValue: 'TRAVEL', DisplayValue: context.localizeText('enroute')},
                 {ReturnValue: 'REVIEW', DisplayValue: context.localizeText('REVIEW')},
                 {ReturnValue: 'REJECTED', DisplayValue: context.localizeText('REJECTED')}],
                };
    }
    return { name: 'OrderMobileStatus_Nav/MobileStatus',
            values: [{ReturnValue: 'RECEIVED', DisplayValue: context.localizeText('received')},
            {ReturnValue: 'STARTED', DisplayValue: context.localizeText('started')},
            {ReturnValue: 'HOLD', DisplayValue: context.localizeText('hold')},
            {ReturnValue: 'TRANSFER', DisplayValue: context.localizeText('transferred')},
            {ReturnValue: 'COMPLETED', DisplayValue: context.localizeText('completed')},
            {ReturnValue: 'TRAVEL', DisplayValue: context.localizeText('enroute')}],
            };
}
