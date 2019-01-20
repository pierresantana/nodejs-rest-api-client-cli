const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const _ = require('lodash');

const inquirer = require('./lib/inquirer');
const api = require('./lib/api');

clear();

console.log(
    chalk.greenBright.bold(
        figlet.textSync('CLI REST Client', {
            horizontalLayout: 'full'
        })
    )
);

const auth = async () => {
    if (!api.getStoredToken()) {
        await api.registerNewToken();
    }
    run();
}

const run = async () => {
    let menu;
    let response;
    do {
        if (!api.getStoredToken()) {
            await api.registerNewToken();
        }
        menu = await inquirer.showMenu();
        if (_.isFunction(api[menu.option])) {
            response = await api[menu.option]();
            if (_.isObject(response)) {
                console.dir(response, {depth: null, colors: true});
            } else {
                console.log(response);
            }
        } else {
            console.log(
                chalk.redBright.bold(`ERROR: Menu option not implemented yet.`)
            );
        }
    } while (menu.option !== 'exit');
}

auth();