#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var cli = require("commander");
var shell = require("shelljs");
var inquirer = require("inquirer");
var fuzzy = require("fuzzy");
var isOnline = require("is-online");
var pkginfo = require('../package.json');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
{
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var connectivity, exec, fuzzySearch, acInquirer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!shell.which('git')) {
                        shell.echo('Cit requires Git.');
                        shell.exit(1);
                    }
                    return [4 /*yield*/, isOnline()];
                case 1:
                    connectivity = _a.sent();
                    if (!connectivity) {
                        shell.echo('Cit requires the Internet.');
                        shell.exit(1);
                    }
                    exec = function (cmd, isDev) {
                        if (isDev === void 0) { isDev = false; }
                        shell.echo("$ " + cmd);
                        if (!isDev) {
                            if (shell.exec(cmd).code !== 0) {
                                shell.echo('Error: exec failed');
                                shell.exit(1);
                            }
                        }
                    };
                    fuzzySearch = function (fuzzyList) {
                        return function (_, input) {
                            input = input || '';
                            return new Promise(function (resolve) {
                                setTimeout(function () {
                                    var fuzzyResult = fuzzy.filter(input, fuzzyList);
                                    resolve(fuzzyResult.map(function (el) {
                                        return el.original;
                                    }));
                                }, 500);
                            });
                        };
                    };
                    acInquirer = function (fuzzyList, question) {
                        if (question === void 0) { question = 'What do you want?'; }
                        return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, inquirer.prompt([{
                                                type: 'autocomplete',
                                                name: 'answer',
                                                message: question,
                                                source: fuzzySearch(fuzzyList)
                                            }])];
                                    case 1:
                                        result = _a.sent();
                                        return [2 /*return*/, result.answer];
                                }
                            });
                        });
                    };
                    cli.command('add <files...>')
                        .description('`git add <files...>`')
                        .action(function (files) {
                        exec("git add " + files.join(' '));
                    });
                    cli.command('branch [newBranch] [originalBranch]')
                        .description('`git branch [newBranch] [originalBranch]`')
                        .action(function (newBranch, originalBranch) {
                        if (!newBranch) {
                            exec('git branch -vva');
                        }
                        else {
                            if (!originalBranch) {
                                exec("git branch " + newBranch);
                                exec("git push -u origin " + newBranch);
                            }
                            else {
                                exec("git branch " + newBranch + " " + originalBranch);
                                exec("git push -u origin " + newBranch);
                            }
                        }
                    });
                    cli.command('checkout <branch>')
                        .description('`git checkout <branch>`')
                        .action(function (branch) {
                        exec("git checkout " + branch);
                    });
                    cli.command('clone <repo>')
                        .description('`git clone <repo>`')
                        .action(function (repo) {
                        exec("git clone " + repo);
                    }).on('--help', function () {
                        shell.echo();
                        shell.echo('  Example: cit clone https://github.com/shamofu/cit.git');
                    });
                    cli.command('commit [message]')
                        .description('`git commit`')
                        .action(function (message) {
                        if (!message) {
                            exec("git commit");
                            exec("git pull --rebase");
                            exec('git push');
                        }
                        else {
                            exec("git commit -m \"" + message + "\"");
                            exec("git pull --rebase");
                            exec('git push');
                        }
                    });
                    cli.command('fetch [remote] [remoteBranch]')
                        .description('`git fetch [remote] +refs/heads/[remoteBranch]:refs/remotes/[remote]/[remoteBranch]`')
                        .option('-p, --prune', '`--prune`')
                        .action(function (remote, remoteBranch, options) {
                        var flags = options.prune ? '--prune' : '';
                        if (!remote) {
                            exec("git fetch " + flags);
                        }
                        else {
                            if (!remoteBranch) {
                                exec("git fetch " + remote + " " + flags);
                            }
                            else {
                                exec("git fetch " + remote + " +refs/heads/" + remoteBranch + ":refs/remotes/" + remote + "/" + remoteBranch + " " + flags);
                            }
                        }
                    });
                    cli.command('init')
                        .description('`git init`')
                        .action(function () {
                        exec('git init');
                    });
                    cli.command('merge <branch>')
                        .description('`git merge <branch>`')
                        .action(function (branch) {
                        exec("git merge " + branch);
                    });
                    cli.command('interactive').alias('i')
                        .description('interactive mode')
                        .action(function () { return __awaiter(_this, void 0, void 0, function () {
                        var command;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, acInquirer(['init', 'clone', 'branch', 'checkout'])];
                                case 1:
                                    command = _a.sent();
                                    shell.echo(command);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    cli.command('*', null, { noHelp: true })
                        .description('default')
                        .action(function () {
                        shell.echo();
                        shell.echo("  Cannot find that command.");
                        shell.echo('  Run `cit` to see all available commands.');
                    });
                    cli.version(pkginfo.version, '-v, --version');
                    cli.parse(process.argv);
                    if (!process.argv.slice(2).length) {
                        cli.help();
                    }
                    return [2 /*return*/];
            }
        });
    }); })();
}
