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
        expect(troublemaker).to.throw("methodName method not found");
    });

    it("doesn't throws if the rpc method exists", function () {
        var peacemaker = function () {
            ps.ensureMethodExists({methodName: sinon.spy()}, {
                method: "methodName",
                params: ["First param"]
            });
        };
        expect(peacemaker).not.to.throw();
    });
});


describe("`authenticate`", function () {

    it("calls the `getUser` function supplied", function () {
        var getUser = sinon.stub().returns(BPromise.resolve());
        var rpc = {
            auth: {a: "a"}
        };
        ps.authenticate(getUser, rpc);
        expect(getUser).to.have.been.calledWith({a: "a"});
    });

    it("adds the (async) return value of `getUser` to the rpc context", function () {
        var context = {};
        var user = {};
        var getUser = sinon.stub().returns(BPromise.resolve(user));
        return ps.authenticate.call(context, getUser, {})
            .then(function () {
                expect(context.user).to.equal(user);
            });
    });

});

describe("`exec`", function () {

    it("calls the rpc method with the correct parameters and the rpc context as method context", function () {
        var methods = {
            methodName: sinon.spy()
        };
        var context = {};
        var rpc = {
            method: "methodName",
            params: [{a: "a"}, {b: "b"}]
        };
        ps.exec.call(context, methods, rpc);
        expect(methods.methodName).to.have.been.calledWith(rpc.params[0], rpc.params[1]);
        expect(methods.methodName).to.have.been.calledOn(context);
    });

});

describe("`succeed`", function () {

    it("calls the succeed method of the lambda context with the rpc result object", function () {
        var lambdaContext = {
            succeed: sinon.spy()
        };
        var result = {a: "a"};
        ps.succeed(lambdaContext, result);
        expect(lambdaContext.succeed).to.have.been.calledWith({result});
    });

});

describe("`fail`", function () {

    it("calls the succeed method of the lambda context with the rpc error object", function () {
        var lambdaContext = {
            succeed: sinon.spy()
        };
        var error = new RpcError(400, "Bad request");
        ps.fail(lambdaContext, error);
        expect(lambdaContext.succeed).to.have.been.calledWith({error});
    });

    it("sends a generic 500 `RpcError` if the error thrown is not an instance of `RpcError`", function () {
        // Stub console.log so that it doesn't spam the tty
        try {
            sinon.stub(console, "log");
            var lambdaContext = {
                succeed: sinon.spy()
            };
            var error = new Error("Error message");
            ps.fail(lambdaContext, error);
            expect(lambdaContext.succeed).to.have.been.calledWith({
                error: new RpcError(500, "Internal server error")
            });
        } catch (e) {
            throw e;
        } finally {
            console.log.restore();
        }
    });

    it("if the error thrown is not an instance of `RpcError`, prints the error to the console", function () {
        try {
            sinon.stub(console, "log");
            var lambdaContext = {
                succeed: sinon.spy()
            };
            var error = new Error("Error message");
            ps.fail(lambdaContext, error);
            expect(console.log).to.have.been.calledWith("Internal server error: Error message");
            expect(console.log).to.have.callCount(2);
        } catch (e) {
            throw e;
        } finally {
            console.log.restore();
        }
    });

});
