import OnDateChanged from '../Common/OnDateChanged';

export default function OverviewOnPageLoad(context) {
    // First time the page has loaded, call OnDateChanged
    OnDateChanged(context);
}
