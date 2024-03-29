function getBaseName(pathname) {
    let release = '/';
    const pathName = pathname.split('/');

    pathName.shift();

    if (pathName[0] === 'preview') {
        pathName.shift();
        release = `/preview/`;
    }

    return `${release}${pathName[0]}/${pathName[1]}`;
}

export default getBaseName;
