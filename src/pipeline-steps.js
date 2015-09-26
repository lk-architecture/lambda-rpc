import {is} from "ramda";
import t from "tcomb-validation";

import RpcError from "./lib/rpc-error";
import RpcType from "./lib/rpc-type";

/*
*   Middleware: can either throw an error or modify the rpcContext (this inside
*   the pipeline function).
*/
export function validate (rpc) {
    var validation = t.validate(rpc, RpcType);
    if (!validation.isValid()) {
        throw new RpcError(400, "Malformed RPC request");
    }
}
export function ensureMethodExists (methods, rpc) {
    if (!methods[rpc.method]) {
        throw new RpcError(404, `${rpc.method} method not found`);
    }
}
export function authenticate (getUser, rpc) {
    return getUser(rpc.auth)
        .then(user => {
            this.user = user;
        });
}

/*
*   Method execution: execs the methods with the rpcContext (this inside the
*   function) which might have been modified by middleware functions.
*/
export function exec (methods, rpc) {
    return methods[rpc.method].apply(this, rpc.params);
}

/*
*   Result handling functions: they receive either a result or an error from the
*   method execution, which they use to send a reply to the client which invoked
*   the rpc.
*/
export function succeed (lambdaContext, result) {
    lambdaContext.succeed({result});
}
export function fail (lambdaContext, error) {
    if (!is(RpcError, error)) {
        console.log(`Internal error:\n${error}`);
        error = new RpcError(500, "Internal server error");
    }
    context.succeed({error});
}
