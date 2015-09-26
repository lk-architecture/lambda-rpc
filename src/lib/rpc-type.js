import t from "tcomb";

export default t.struct({
    method: t.String,
    params: t.Array,
    auth: t.union([
        t.struct({
            username: t.String,
            password: t.String
        }),
        t.struct({
            token: t.String
        }),
        t.Nil
    ])
});
