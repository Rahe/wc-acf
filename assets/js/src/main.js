/**
 * Main.js
 */
// Object basic
var fr;
if (!fr) {
    fr = {};
} else {
    if (typeof fr !== "object") {
        throw new Error('fr already exists and not an object');
    }
}

if (!fr.wc_acf) {
    fr.wc_acf = {};
} else {
    if (typeof fr.wc_acf !== "object") {
        throw new Error('fr.wc_acf already exists and not an object');
    }
}


Backbone.sync = function( method, model, success ) {"use strict";
    success.success( );
};

fr.wc_acf = {
    views : {},
    models : {},
    collections : {}
};