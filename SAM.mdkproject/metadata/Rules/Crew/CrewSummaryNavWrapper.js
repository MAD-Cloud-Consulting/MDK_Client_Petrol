import libCrew from './CrewLibrary';

export default function CrewSummaryNavWrapper(context) {

    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    let pageProxy = context;
    if (typeof pageProxy.getPageProxy === 'function') { 
        pageProxy = context.getPageProxy();
    }
    let actionContext = pageProxy.getActionBinding();

    return libCrew.initializeCrewHeader(context).then( function() { //Initialize today's crew
        pageProxy.setActionBinding(actionContext);  
        return pageProxy.executeAction('/SAPAssetManager/Actions/Crew/CrewSummaryNav.action');
    });
    
}
