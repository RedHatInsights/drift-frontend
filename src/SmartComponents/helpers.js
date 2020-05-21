function findCheckedValue(total, selected) {
    if (selected === total && total > 0) {
        return true;
    } else if (selected > 0 && selected < total) {
        return null;
    } else {
        return false;
    }
}

export default {
    findCheckedValue
};
