[![Build Status](https://app.travis-ci.com/RedHatInsights/drift-frontend.svg?branch=master)](https://app.travis-ci.com/RedHatInsights/drift-frontend)

# Drift Frontend

## Getting Started

There is a [comprehensive quick start guide in the Storybook Documentation](https://github.com/RedHatInsights/insights-frontend-storybook/blob/master/src/docs/welcome/quickStart/DOC.md) to setting up an Insights environment complete with:
- [Insights Chroming](https://github.com/RedHatInsights/insights-chrome)
- [Insights Proxy](https://github.com/RedHatInsights/insights-proxy)

Note: You will need to set up the Insights environment if you want to develop with the app due to the consumption of the chroming service as well as setting up your global/app navigation through the API.

## Developing

### First time setup
1. Make sure you have [`Node.js`](https://nodejs.org/en/) and [`npm`](https://www.npmjs.com/) installed
2. Run [script to patch your `/etc/hosts`](https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh)
3. Make sure you are using [Red Hat proxy](http://hdn.corp.redhat.com/proxy.pac)
4. Clone this repository
5. Run ```npm install``` to install dependencies

### Running locally
1. Run ```npm run start:proxy``` to start chrome proxy and webpack bundler which serves the files with webpack dev server
2. App will be running at ```https://stage.foo.redhat.com:1337/insights/drift/```
## Testing
### Testing locally
- `npm run test` will run all tests
- `npm run lint` will run linter

### Update test snapshots
- `npm run test -- -u`

## Debug
Ensure the following entry is in your `/etc/hosts` file:
```
127.0.0.1 prod.foo.redhat.com
127.0.0.1 stage.foo.redhat.com
127.0.0.1 qa.foo.redhat.com
127.0.0.1 ci.foo.redhat.com
```

## how to run with Clowder drift-backend

OBS: First go through the steps in [drift-dev-setup](https://github.com/RedHatInsights/drift-dev-setup#run-with-clowder).

In terminal run:
```
npm run ephemeral
```

This will route requests to pods running in ephemeral cluster.

Note: If you see `ℹ ｢wdm｣: Compiled successfully.`, you are in good shape.

Finally, hit the following URL in your browser. If you are not logged in, you will be prompted to do so.

https://ci.foo.redhat.com:1337/insights/drift

## how to run with Stage drift-backend

In terminal run:
```
npm run stage
```

This will route requests to pods running in stage.

Note: If you see `ℹ ｢wdm｣: Compiled successfully.`, you are in good shape.

Finally, hit the following URL in your browser. If you are not logged in, you will be prompted to do so.

https://stage.foo.redhat.com:1337/apps/drift/


## how to run with local drift-backend

OBS: First go through the steps in [drift-dev-setup](https://github.com/RedHatInsights/drift-dev-setup#run-with-clowder).

And have backend services running locally with [sh run_app_locally](https://github.com/RedHatInsights/drift-backend/blob/master/run_app_locally.sh)

In terminal run:
```
npm run local
```

This will route requests to services running locally.

Finally, hit the following URL in your browser. If you are not logged in, you will be prompted to do so.

https://ci.foo.redhat.com:1337/insights/drift

## Testing federated modules with another application

If you want to test Drift with another application deployed locally, you can utilize `LOCAL_APPS` environment variable and deploy the needed application on separate ports. To learn more about the variable, see https://github.com/RedHatInsights/frontend-components/tree/master/packages/config#running-multiple-local-frontend-applications.

### Example

We'll take for example [insights-inventory-frontend](https://github.com/RedHatInsights/insights-inventory-frontend).

Open new terminal, navigate to Inventory repository, and run it on a separate port without proxy:

```
npm run start -- --port=8003
```

In a separate terminal, run Drift with proxy enabled and list Inventory:

```
LOCAL_APPS=inventory:8003~http npm run start:proxy
```

## troubleshooting

If you are updating the drift-frontend app after a long period of time away, your node_modules folder may not be up to date with the packages outlined in the `package.json` file. The easiest way to update this quickly and efficiently is to fun the following commands in a terminal window.
```
cd drift-frontend
rm -rf node_modules
npm i
```

After the packages are installed, you should be able to run `npm run start` in the same terminal to get the app up and running.

## to run sonarqube
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
