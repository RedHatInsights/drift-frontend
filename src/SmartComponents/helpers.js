function findCheckedValue(total, selected) {
    if (selected === total && total > 0) {
        return true;
    } else if (selected > 0 && selected < total) {
        return null;
    } else {
        return false;
    }
}

function paginateData(data, selectedPage, itemsPerPage) {
    let paginatedData = [];

    if (data === null || !data.length) {
        return [];
    }

    for (let i = 0; i < data.length; i++) {
        if (Math.ceil((i + 1) / itemsPerPage) === selectedPage) {
            paginatedData.push(data[i]);
        }
    }

    return paginatedData;
}

export default {
    findCheckedValue,
    paginateData
};
