import SetIndicatorState from '../../../Documents/SetIndicatorState';

export default function PRTSetIndicatorStateWrapper(sectionProxy) {
    return SetIndicatorState(sectionProxy, '#Property:PRTDocument/#Property:@odata.readLink');
}
