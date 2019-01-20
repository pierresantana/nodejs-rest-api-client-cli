const inquirer = require('inquirer');

module.exports = {
  askAuthCredentials: () => {
    const questions = [{
        name: 'email',
        type: 'input',
        message: 'Enter your e-mail address:',
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your e-mail address.';
          }
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your password.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
  showMenu: () => {
    const questions = {
      type: 'list',
      name: 'option',
      message: 'What do you want to do?',
      choices: [
        new inquirer.Separator(),
        {
          name: 'List users',
          value: 'listUsers'
        },
        {
          name: 'Show user info',
          value: 'userInfo'
        },
        {
          name: 'Add user',
          value: 'addUser'
        },
        {
          name: 'Change user',
          value: 'changeUser'
        },
        new inquirer.Separator(),
        {
          name: 'Show token info',
          value: 'tokenInfo'
        },
        new inquirer.Separator(),
        {
          name: 'Exit',
          value: 'exit'
        }
      ]
    };
    return inquirer.prompt(questions);
  }
}