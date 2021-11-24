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

OBS: First go through the steps in [drift-dev-setup](https://github.com/RedHatInsights/drift-dev-setup#run-with-clowder).

In terminal run:
```
npm run ephemeral
```

This will route requests to pods running in ephemeral cluster.

Note: If you see `ℹ ｢wdm｣: Compiled successfully.`, you are in good shape.

Finally, hit the following URL in your browser. If you are not logged in, you will be prompted to do so.

https://ci.foo.redhat.com:1337/insights/drift

# how to run with Stage drift-backend

In terminal run:
```
npm run stage
```

This will route requests to pods running in stage.

Note: If you see `ℹ ｢wdm｣: Compiled successfully.`, you are in good shape.

Finally, hit the following URL in your browser. If you are not logged in, you will be prompted to do so.

https://stage.foo.redhat.com:1337/apps/drift/


# how to run with local drift-backend

OBS: First go through the steps in [drift-dev-setup](https://github.com/RedHatInsights/drift-dev-setup#run-with-clowder).

And have backend services running locally with [sh run_app_locally](https://github.com/RedHatInsights/drift-backend/blob/master/run_app_locally.sh)

In terminal run:
```
npm run local
```

This will route requests to services running locally.

Finally, hit the following URL in your browser. If you are not logged in, you will be prompted to do so.

https://ci.foo.redhat.com:1337/insights/drift

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
