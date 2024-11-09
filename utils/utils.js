const cld = require('cld');
class Utils {
    static async isAdEnglish(text) {
        const result = await cld.detect(text);

        if (result.reliable) {
            const englishLanguage = result.languages.find(lang => lang.name === 'ENGLISH');

            if (englishLanguage && englishLanguage.percent > 80) {
                return true;
            }
        }

        return false;
    }
}
module.exports = { Utils };