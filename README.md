[![Build Status](https://travis-ci.org/innowatio/lambda-rpc.svg?branch=master)](https://travis-ci.org/innowatio/lambda-rpc)
[![Coverage Status](https://coveralls.io/repos/innowatio/lambda-rpc/badge.svg?branch=master&service=github)](https://coveralls.io/github/innowatio/lambda-rpc?branch=master)
[![Dependency Status](https://david-dm.org/innowatio/lambda-rpc.svg)](https://david-dm.org/innowatio/lambda-rpc)
[![devDependency Status](https://david-dm.org/innowatio/lambda-rpc/dev-status.svg)](https://david-dm.org/innowatio/lambda-rpc#info=devDependencies)

#lambda-rpc

## Example usage

```js
import LambdaRpc from "lambda-rpc";
import {exec} from "child_process";

var lambdaRpc = new LambdaRpc()
    .methods({
        cowSay: function (message) {
            return new Promise(function (resolve, reject) {
                exec(`cowsay ${message}`, function (err, stdout) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(stdout);
                    }
                });
            });        }
    })
    .methods({
        echo: function (message) {
            return message;
        }
    });

export var handler = lambdaRpc.getRouter();
```
