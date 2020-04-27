module.exports = {
    rawTextToNumber: (rawText) => {
        const splits = rawText.split('\\')[0];
        if (splits.split('%').length > 1) {
            if (!isNaN(Number(splits.split('%')[0].trim()))) {
                return Number(splits.split('%')[0].trim());
            }
            return splits.split('%')[0].trim();
        }
        if (!isNaN(Number(rawText.split('\\')[0].trim()))) {
            return Number(rawText.split('\\')[0].trim());
        }
        return rawText.split('\\')[0].trim();
    },
    randomNumber: (minimum, maximum) => {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }
}