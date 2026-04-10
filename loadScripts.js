const fs = require('fs');
const vm = require('vm');
const path = require('path');

function loadScriptsIntoContext(files) {
    const context = {
        console,
        setTimeout,
        setInterval,
        clearInterval,
        clearTimeout,
    };

    context.global = context; // important!

    const vmContext = vm.createContext(context);

    for (const file of files) {
        const code = fs.readFileSync(path.resolve(__dirname, file), 'utf-8');
        vm.runInContext(code, vmContext, { filename: file });
    }

    return context;
}

module.exports = loadScriptsIntoContext;