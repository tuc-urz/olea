import { merge } from "lodash";

export default ({ config }) => {
    let extraConfig = {};

    if (process.env.VARIANT === "development") {
        extraConfig = require("./app.development.json");
    } else if (process.env.VARIANT === "staging") {
        extraConfig = require("./app.staging.json");
    }

    return merge(config, extraConfig);
};
