/**
* Describe this function...
* @param {IClientAPI} context
*/
import GetUserPersonasOnline from './GetUserPersonasOnline';
import InitilzePersonasOffline from '../Common/InitilzePersonasOffline';
 
export default function GetUserPersonas(context) {
    if (context.isDemoMode()) {
        return InitilzePersonasOffline(context);
    } else {
        return GetUserPersonasOnline(context);
    }
}
