const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');
const Configstore = require('configstore');
const pkg = require('../package.json');
const CLI = require('clui');
const Spinner = CLI.Spinner;

const inquirer = require('./inquirer');

const conf = new Configstore(pkg.name);

const handleError = (error) => {
    if (error.response.status === 403) {
        clearToken();
    }
    console.log(chalk.redBright.bold(`ERROR: (${error.response.status}) ${error.response.statusText}`));
};

const getStoredToken = () => {
    return conf.get('api.accessToken');
};

const getStoredUserId = () => {
    return conf.get('api.userId');
};

const registerNewToken = async () => {
    const credentials = await inquirer.askAuthCredentials();
    const status = new Spinner('Authenticating, please wait...');
    let accessToken, info;
    status.start();

    await axios.post('http://localhost:3000/auth', credentials)
        .then((response) => {
            accessToken = response.data.accessToken;
            if (!response.data.accessToken) {
                throw new Error("Missing Token", "API token was not found in the response");
            }
            conf.set('api.accessToken', accessToken);
            conf.set('api.refreshToken', response.data.refreshToken);

        })
        .catch(handleError);

    if (accessToken) {
        info = await tokenInfo();
        conf.set('api.userId', info.userId);
    }

    status.stop();
    return accessToken;
};

const clearToken = () => {
    conf.clear();
}

const exit = () => {
    clearToken();
    return chalk.blueBright.bold(`See ya soon`)
}

const tokenInfo = async () => {
    const status = new Spinner('Loading token info...');
    const data = await axios.get('http://localhost:3000/auth/info', {
        headers: {'Authorization': `Bearer ${getStoredToken()}`}
    })
        .then((response) => response.data)
        .catch(handleError);

    status.stop();
    return data;
};

const listUsers = async () => {
    const status = new Spinner('Loading users...');
    const data = await axios.get('http://localhost:3000/users', {
        headers: {'Authorization': `Bearer ${getStoredToken()}`}
    })
        .then((response) => response.data)
        .catch(handleError);

    status.stop();
    return data;
};

const userInfo = async () => {
    const status = new Spinner('Loading user info...');
    const data = await axios.get(`http://localhost:3000/users/${getStoredUserId()}`, {
        headers: {'Authorization': `Bearer ${getStoredToken()}`}
    })
        .then((response) => response.data)
        .catch(handleError);

    status.stop();
    return data;
};

module.exports = {
    getStoredToken,
    registerNewToken,
    exit,
    tokenInfo,
    listUsers,
    userInfo
}