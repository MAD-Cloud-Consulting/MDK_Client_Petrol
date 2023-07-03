import post from './PhysicalInventoryDocItemUpdatePost';

export default function PhysicalInventoryDocItemNextPostWrapper(context) {
    return post(context, false);
}
