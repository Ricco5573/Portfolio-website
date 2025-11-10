/**
 * Implementation of the HBO-ICT.Cloud library
 *
 * @version 1.0.0
 * @author Lennard Fonteijn
 *
 * @namespace HICCloud
 */
const HICCloud = {};

/**
 * API-extension for the HBO-ICT.Cloud library
 *
 * @author Lennard Fonteijn
 *
 * @namespace API
 * @memberof HICCloud
 */
HICCloud.API = (function () {
    let options = {
        url: undefined,
        apiKey: undefined,
        database: undefined
    };

    const exports = {
        configure: configure,
        queryDatabase: configurationError
    };

    /**
     * @memberof HICCloud.API
     *
     * @description Configure the HBO-ICT.Cloud API
     * @param {HICCloud.API.Options} newOptions Options-object to configure the HBO-ICT.Cloud API
     *
     * @returns {boolean} Returns true when the configuration is valid, otherwise false.
     */
    function configure(newOptions) {
        const errors = [];

        if (!newOptions.url) {
            errors.push("- url => API-URL from HBO-ICT.Cloud");
        }

        if (!newOptions.apiKey) {
            errors.push("- apiKey => API-Key from HBO-ICT.Cloud");
        }

        if (!newOptions.database) {
            errors.push("- database => Name of target database for queries");
        }

        if (errors.length > 0) {
            alert(`HBO-ICT.Cloud API configuration is missing one or more properties:\n${errors.join("\n")}`);

            return false;
        }

        options = newOptions;

        exports.queryDatabase = queryDatabase;
        return true;
    }

    /**
     * @memberof HICCloud.API
     *
     * @description Send a SQL query to the configured database
     * @param {string} query Query written in SQL
     * @param {...*} values Values to replace question marks (?) in the query with. Replacing is done from left to right.
     *
     * @returns {Promise<(Array<Object>|string)>} Returns a promise which can either fail (string with reason) or succeed (Array<Object> with results).
     */
    function queryDatabase(query, ...values) {
        return handleFetch(options.url + "/db", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${options.apiKey}`
            },
            body: JSON.stringify({
                query: query,
                values: values,
                database: options.database
            })
        });
    }

    function handleFetch(url, fetchOptions) {
        return new Promise(function (resolve, reject) {
            fetch(url, fetchOptions)
                .then(function (response) {
                    const statusCode = response.status;

                    response.json().then(function(data) {
                        if (statusCode === 200) {
                            resolve(data);
                        }
                        else {
                            apiFail(reject, statusCode, data.reason);
                        }
                    });
                })
                .catch(function (error) {
                    apiFail(reject, 500, error);
                });
        });
    }

    function apiFail(reject, statusCode, reason) {
        if (statusCode === 400) {
            reject(reason || "Something bad happened, see console.");
        }
        else {
            reject("Something bad happened, see console.");
        }
    }

    function configurationError() {
        return Promise.reject("HBO-ICT.Cloud API is not properly configured!");
    }

    /**
     * @memberof HICCloud.API
     *
     * @description Holds all options for the HBO-ICT.Cloud API
     * @property {string} url URL of the HBO-ICT.Cloud API
     * @property {string} apiKey API-Key to authenticate yourself with the HBO-ICT.Cloud API
     * @property {string} database Name of the database you want to query by default
     */

    return exports;
})();