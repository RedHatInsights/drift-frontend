[![Build Status](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app)

# Drift Frontend

# how to install

```
git clone https://github.com/RedHatInsights/drift-frontend
cd drift-frontend
npm install
npm run start
```

Ensure the following entry is in your `/etc/hosts` file:
```
127.0.0.1 prod.foo.redhat.com
127.0.0.1 stage.foo.redhat.com
127.0.0.1 qa.foo.redhat.com
127.0.0.1 ci.foo.redhat.com
```

# how to run with Clowder drift-backend

Ensure insights-proxy repo (https://github.com/RedHatInsights/insights-proxy) exists in the same parent directory that contains `/drift-frontend`


OBS: First go through the steps in [drift-dev-setup](https://github.com/RedHatInsights/drift-dev-setup#run-with-clowder).

Make sure to run these commands in 2 different terminals at the sametime.

In terminal 1:
```
cd drift-frontend
USE_CLOUD=true PLATFORM=linux CUSTOM_CONF_PATH=$PWD/profiles/local-frontend-and-ephemeral-cluster.js npm --prefix ../insights-proxy/ run start
```

In terminal 2:
```
cd drift-frontend
npm run start
```
Note: If you see `ℹ ｢wdm｣: Compiled successfully.`, you are in good shape.

Finally, hit the following URL in your browser. If you are not logged in, you will be prompted to do so.

https://ci.foo.redhat.com:1337/insights/drift

# how to run with CI drift-backend

Ensure insights-proxy repo (https://github.com/RedHatInsights/insights-proxy) exists in the same parent directory that contains `/drift-frontend`

Make sure to run these commands in 2 different terminals at the sametime.

In terminal 1:
```
cd drift-frontend
USE_CLOUD=true SPANDX_CONFIG=profiles/local-frontend.js  bash ../insights-proxy/scripts/run.sh
```

In terminal 2:
```
cd drift-frontend
npm run start
```
Note: If you see `ℹ ｢wdm｣: Compiled successfully.`, you are in good shape.

Finally, hit the following URL in your browser. If you are not logged in, you will be prompted to do so.

https://ci.foo.redhat.com:1337/insights/drift


# how to run with local drift-backend

Ensure drift-backend repo (https://github.com/RedHatInsights/drift-backend) exists in the same parent directory that contains `/drift-frontend`. There is already a `local-drift-backend.js` file in the drift-backend git repo.

Make sure to run these commands in 2 different terminals at the sametime.

In terminal 1:

```
cd drift-frontend
USE_CLOUD=true SPANDX_CONFIG=../drift-backend/local-drift-backend.js bash ../insights-proxy/scripts/run.sh
```

In terminal 2:

```
cd drift-frontend
npm run start
```

# how to run with [drift-dev-setup](https://github.com/RedHatInsights/drift-dev-setup)

In terminal
```
cd drift-frontend
USE_CLOUD=true SPANDX_PORT=1338 SPANDX_CONFIG=profiles/local-drift-dev-setup.js bash ../insights-proxy/scripts/run.sh
```
Note that `SPANDX_PORT` should be different from the port used for [drift-dev-setup](https://github.com/RedHatInsights/drift-dev-setup) which is `1337` by default.

In another terminal
```
cd drift-frontend
npm run start -- --port 8001 # value set in profiles/local-drift-dev-setup.js
```

This way we can have running both frontend from container via [drift-dev-setup](https://github.com/RedHatInsights/drift-dev-setup) and one from local source each running on different port.


# troubleshooting

If you are updating the drift-frontend app after a long period of time away, your node_modules folder may not be up to date with the packages outlined in the `package.json` file. The easiest way to update this quickly and efficiently is to fun the following commands in a terminal window.
```
cd drift-frontend
rm -rf node_modules
npm i
```

After the packages are installed, you should be able to run `npm run start` in the same terminal to get the app up and running.

# to run sonarqube
1. Make sure that you have SonarQube scanner installed.
2. Duplicate the `sonar-scanner.properties.sample` config file.
```
  cp sonar-scanner.properties.sample sonar-scanner.properties
```
3. Update `sonar.host.url`, `sonar.login` in `sonar-scanner.properties`.
4. Run the following command
```
java -jar /path/to/sonar-scanner-cli-4.6.0.2311.jar -D project.settings=sonar-scanner.properties
```
5. Review the results in your SonarQube web instance.
