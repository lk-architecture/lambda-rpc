import {always, merge, partial} from "ramda";
import BPromise from "bluebird";

import * as ps from "./pipeline-steps";

export default class LambdaRpc {

    constructor (getUser) {
        this._getUser = getUser || always(BPromise.resolve(null));
        this._methods = {};
    }

    methods (methodsMap) {
        this._methods = merge(this._methods, methodsMap);
        return this;
    }

    getRouter () {
        return (rpcBody, lambdaContext) => {
            var rpcContext = {};
            return BPromise.bind(rpcContext)
                // Middleware
                .then(partial(ps.validate, rpcBody))
                .then(partial(ps.ensureMethodExists, this._methods, rpcBody))
                .then(partial(ps.authenticate, this._getUser, rpcBody))
                // Method execution
                .then(partial(ps.exec, this._methods, rpcBody))
                // Result handling
                .then(partial(ps.succeed, lambdaContext))
                .catch(partial(ps.fail, lambdaContext));
        };
    }

}

export {default as RpcError} from "./lib/rpc-error";
