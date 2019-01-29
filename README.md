[![Build Status](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app)

# Drift Frontend

# how to run

```
git clone https://github.com/RedHatInsights/drift-frontend
cd drift-frontend
npm install
npm run start
```

If you see `ℹ ｢wdm｣: Compiled successfully.`, you are in good shape.

# how to run with local drift-backend

There is already a `local-drift-backend.js` file in the drift-backend git repo.

Simply run:

`SPANDX_CONFIG=drift-backend/local-drift-backend.js bash insights-proxy/scripts/run.sh`

