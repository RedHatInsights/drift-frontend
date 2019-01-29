[![Build Status](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app)

# Drift Frontend

# how to run

* check out repo
* cd to repo
* `npm install`
* `npm run start`

If you see `ℹ ｢wdm｣: Compiled successfully.`, you are in good shape.

# how to run with local drift-backend

make a js file somewhere that looks like this

```
module.exports.routes = {
           '/r/insights/platform/drift' : { host: 'http://localhost:8080' },
}
```

then run insights-proxy with `SPANDX_CONFIG=/path/to/file`.

