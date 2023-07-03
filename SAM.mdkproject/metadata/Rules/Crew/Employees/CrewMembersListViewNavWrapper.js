import libCrew from '../CrewLibrary';

export default function CrewMembersListViewNavWrapper(context) {

    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    let pageProxy = context;
    if (typeof pageProxy.getPageProxy === 'function') { 
        pageProxy = context.getPageProxy();
    }
    let actionContext = pageProxy.getActionBinding();

    libCrew.initializeCrewHeader(context).then( function() { //Initialize today's crew
        pageProxy.setActionBinding(actionContext); 
        return pageProxy.executeAction('/SAPAssetManager/Actions/Crew/CrewMembersListViewNav.action');
    });
    
}
