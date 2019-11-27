Object.assign(global, require('chai'));

process.on('unhandledRejection', error => { throw error; });
