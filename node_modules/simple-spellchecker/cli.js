/*
 * Copyright (c) 2016 José F. Maldonado
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Load dependencies.
const SpellChecker = require('./index.js');

// Read action.
var action = process.argv.length > 2? process.argv[2].toLowerCase() : '';

// Verify if must check a word.
if(action == 'check') {
    // Read parameters.
    var inputFolder = process.argv.length > 3? process.argv[3] : null;
    var fileName = process.argv.length > 4? process.argv[4] : null;
    var word = process.argv.length > 5? process.argv[5] : null;
    
    // Get dictionary.
    SpellChecker.getDictionary(fileName, inputFolder, function(err, res) {
        // Show result.
        if(err) {
            console.log(err);
        } else {
            var dictionary = res;
            console.log(dictionary.checkAndSuggest(word));
        }
        
        // Close process.
        process.exit();
    });
}

// Verify if must normalize a dictionary file.
if(action == 'normalize') {
    // Read parameters.
    var inputFile = process.argv.length > 3? process.argv[3] : null;
    var outputFile = process.argv.length > 4? process.argv[4] : null;
    
    // Get dictionary.
    SpellChecker.normalizeDictionary(inputFile, outputFile, function(err, success) {
        // Show result.
        if(err) {
            console.log(err);
        } else {
            console.log("The file was normalized");
        }
        
        // Close process.
        process.exit();
    });    
}

