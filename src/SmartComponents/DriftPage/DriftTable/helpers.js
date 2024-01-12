const shiftReferenceToFront = (mainList, referenceId) => {
    const index = mainList.findIndex((item) => {
        return item.id === referenceId;
    });

    const systemToMove = mainList.splice(index, 1);

    mainList.unshift(systemToMove[0]);
    return mainList;
};

export const formatEntities = (systems, baselines, historicalProfiles, referenceId) => {
    /*eslint-disable camelcase*/
    let fullHistoricalSystemList = [];
    let historicalGroups = {};
    let mainList;

    if (systems.length === 0 && baselines.length === 0 && historicalProfiles.length === 0) {
        return [];
    }

    systems = systems.map((system) => {
        system.type = 'system';
        return system;
    });
    baselines = baselines.map((baseline) => {
        baseline.type = 'baseline';
        return baseline;
    });
    historicalProfiles = historicalProfiles.map((hsp) => {
        hsp.type = 'historical-system-profile';
        return hsp;
    });

    historicalProfiles.forEach((hsp) => {
        if (Object.prototype.hasOwnProperty.call(historicalGroups, hsp.system_id)) {
            historicalGroups[hsp.system_id].push(hsp);
        } else {
            historicalGroups[hsp.system_id] = [ hsp ];
        }
    });

    fullHistoricalSystemList = systems;

    // eslint-disable-next-line no-unused-vars
    for (const [ system_id, hsps ] of Object.entries(historicalGroups)) {
        const system = systems.find(item => system_id === item.id);

        if (system !== undefined) {
            const index = fullHistoricalSystemList.indexOf(system);
            fullHistoricalSystemList = [
                ...fullHistoricalSystemList.slice(0, index + 1),
                ...hsps,
                ...fullHistoricalSystemList.slice(index + 1, fullHistoricalSystemList.length)
            ];
        } else {
            fullHistoricalSystemList = fullHistoricalSystemList.concat(hsps);
        }
    }
    /*eslint-enable camelcase*/

    mainList = baselines.concat(fullHistoricalSystemList);

    if (referenceId) {
        mainList = shiftReferenceToFront(mainList, referenceId);
    }

    return mainList;
};
