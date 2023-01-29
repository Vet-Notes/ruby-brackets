"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode_1 = require("vscode");
const config_1 = require("../../config");
const wait = (amount = 0) => new Promise((resolve) => setTimeout(resolve, amount));
suite("Auto Add Brackets in String Interpolation", async () => {
    test("does nothing when language is not enabled", async () => {
        const expectedResult = "`test`";
        const textDocument = await vscode_1.workspace.openTextDocument({
            content: expectedResult,
            language: "java",
        });
        const editor = await vscode_1.window.showTextDocument(textDocument);
        editor.selection = new vscode_1.Selection(new vscode_1.Position(0, 2), new vscode_1.Position(0, 6));
        await vscode_1.commands.executeCommand("auto.addInterpolation");
        await wait(500);
        const result = editor.document.getText();
        assert.strictEqual(result, expectedResult);
    });
    for (let language in config_1.default.languages) {
        testDefaultSupportedLanguages(language, config_1.default.languages[language]);
    }
});
function testDefaultSupportedLanguages(language, config) {
    test(`[${language}] write the symbol when activated outside of a string wrapper`, async () => {
        const textDocument = await vscode_1.workspace.openTextDocument({
            content: "",
            language: language,
        });
        const editor = await vscode_1.window.showTextDocument(textDocument);
        await vscode_1.commands.executeCommand("auto.addInterpolation");
        await wait(500);
        const result = editor.document.getText();
        assert.strictEqual(result, config.symbol);
    });
    test(`[${language}] interpolation when inside a string wrapper but no selection`, async () => {
        const textDocument = await vscode_1.workspace.openTextDocument({
            content: `${config.stringWrapper}test ${config.stringWrapper}`,
            language: language,
        });
        const editor = await vscode_1.window.showTextDocument(textDocument);
        editor.selection = new vscode_1.Selection(new vscode_1.Position(0, 6), new vscode_1.Position(0, 6));
        await vscode_1.commands.executeCommand("auto.addInterpolation");
        await wait(500);
        const result = editor.document.getText();
        assert.strictEqual(result, `${config.stringWrapper}test ${config.symbol}{}${config.stringWrapper}`);
    });
    test(`[${language}] interpolation with stringWrapper character escaped`, async () => {
        const textDocument = await vscode_1.workspace.openTextDocument({
            content: `${config.stringWrapper}\\${config.stringWrapper} ${config.stringWrapper}`,
            language: language,
        });
        const editor = await vscode_1.window.showTextDocument(textDocument);
        editor.selection = new vscode_1.Selection(new vscode_1.Position(0, 4), new vscode_1.Position(0, 4));
        await vscode_1.commands.executeCommand("auto.addInterpolation");
        await wait(500);
        const result = editor.document.getText();
        assert.strictEqual(result, `${config.stringWrapper}\\${config.stringWrapper} ${config.symbol}{}${config.stringWrapper}`);
    });
    test(`[${language}] interpolation when one word is selected`, async () => {
        const textDocument = await vscode_1.workspace.openTextDocument({
            content: `${config.stringWrapper}test${config.stringWrapper}`,
            language: language,
        });
        const editor = await vscode_1.window.showTextDocument(textDocument);
        editor.selection = new vscode_1.Selection(new vscode_1.Position(0, 1), new vscode_1.Position(0, 5));
        await vscode_1.commands.executeCommand("auto.addInterpolation");
        await wait(500);
        const result = editor.document.getText();
        assert.strictEqual(result, `${config.stringWrapper}${config.symbol}{test}${config.stringWrapper}`);
    });
    test(`[${language}] interpolation with multiple cursors`, async () => {
        const textDocument = await vscode_1.workspace.openTextDocument({
            content: `${config.stringWrapper}test test_test${config.stringWrapper}`,
            language: language,
        });
        const editor = await vscode_1.window.showTextDocument(textDocument);
        editor.selections = [
            new vscode_1.Selection(new vscode_1.Position(0, 1), new vscode_1.Position(0, 5)),
            new vscode_1.Selection(new vscode_1.Position(0, 6), new vscode_1.Position(0, 15)),
        ];
        await vscode_1.commands.executeCommand("auto.addInterpolation");
        await wait(500);
        const result = editor.document.getText();
        assert.strictEqual(result, `${config.stringWrapper}${config.symbol}{test} ${config.symbol}{test_test}${config.stringWrapper}`);
    });
}
//# sourceMappingURL=extension.test.js.map