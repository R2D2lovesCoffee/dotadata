module.exports = {
    rawTextToNumber: (rawText) => {
        const splits = rawText.split('\\')[0];
        if (splits.split('%').length > 1) {
            if (Number(splits.split('%')[0])) {
                return Number(splits.split('%')[0]);
            }
            return splits.split('%')[0];
        }
        if (Number(rawText.split('\\')[0])) {
            return Number(rawText.split('\\')[0]);
        }
        return rawText.split('\\')[0];
    }
}