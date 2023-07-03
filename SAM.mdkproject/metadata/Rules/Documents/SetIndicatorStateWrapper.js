import SetIndicatorState from './SetIndicatorState';

export default function SetIndicatorStateWrapper(sectionProxy) {
    return SetIndicatorState(sectionProxy, '#Property:Document/#Property:@odata.readLink');
}
