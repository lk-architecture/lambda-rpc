import {always} from "ramda";
import BPromise from "bluebird";
import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import * as ps from "pipeline-steps";
import RpcError from "lib/rpc-error";

describe("`validate`", function () {

    it("throws a 400 `RpcError` if the rpcBody is malformed", function () {
        var troublemaker = function () {
            ps.validate({
                method: "This rpc lacks the `params` property"
            });
        };
        expect(troublemaker).to.throw(RpcError);
    });

    it("doesn't throw if the rpcBody is not malformed", function () {
        var peacemaker = function () {
            ps.validate({
                method: "This rpc is valid",
                params: ["First param"]
            });
        };
        expect(peacemaker).not.to.throw();
    });

});

describe("`ensureMethodExists`", function () {

    it("throws a 404 `RpcError` if the rpc method doesn't exist", function () {
        var troublemaker = function () {
            ps.ensureMethodExists({}, {
                method: "methodName",
                params: ["First param"]
            });
        };
        expect(troublemaker).to.throw(RpcError);
        try {
            troublemaker();
        } catch (e) {
            expect(e.code).to.equal(404);
        }
    });

    it("doesn't throws if the rpc method exists", function () {
        var peacemaker = function () {
            ps.ensureMethodExists({methodName: sinon.spy()}, {
                method: "methodName",
                params: ["First param"]
            });
        };
        expect(peacemaker).not.to.throw(RpcError);
    });
});


describe("`authenticate`", function () {

    // it("calls the `getUser` function supplied", function () {
    //
    // });

    // it("adds the (possibly async) return value of `getUser` to the rpc context", function () {
    //
    // });

});
//
// describe("`exec`", function () {
//
//     it("calls the rpc method with the correct parameters and the rpc context as method context", function () {
//
//     });
//
// });
//
// describe("`succeed`", function () {
//
//     it("calls the succeed method of the lambda context with the rpc result object", function () {
//
//     });
//
// });
//
// describe("`fail`", function () {
//
//     it("calls the succeed method of the lambda context with the rpc error object", function () {
//
//     });
//
//
//     it("sends a generic 500 `RpcError` if the error thrown is not an instance of `RpcError`", function () {
//
//     });
//
// });
