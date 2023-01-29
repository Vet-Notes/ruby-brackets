"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function config() {
    const languages = vscode_1.workspace.getConfiguration("auto").get("languages", {});
    return {
        languages: languages,
    };
}
exports.default = config();
//# sourceMappingURL=config.js.map