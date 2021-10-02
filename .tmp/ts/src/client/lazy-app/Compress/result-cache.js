import { shallowEqual } from '../util';
const SIZE = 5;
export default class ResultCache {
    constructor() {
        this._entries = [];
    }
    add(entry) {
        // Add the new entry to the start
        this._entries.unshift(entry);
        // Remove the last entry if we're now bigger than SIZE
        if (this._entries.length > SIZE)
            this._entries.pop();
    }
    match(preprocessed, processorState, encoderState) {
        const matchingIndex = this._entries.findIndex((entry) => {
            // Check for quick exits:
            if (entry.preprocessed !== preprocessed)
                return false;
            if (entry.encoderState.type !== encoderState.type)
                return false;
            // Check that each set of options in the preprocessor are the same
            for (const prop in processorState) {
                if (!shallowEqual(processorState[prop], entry.processorState[prop])) {
                    return false;
                }
            }
            // Check detailed encoder options
            if (!shallowEqual(encoderState.options, entry.encoderState.options)) {
                return false;
            }
            return true;
        });
        if (matchingIndex === -1)
            return undefined;
        const matchingEntry = this._entries[matchingIndex];
        if (matchingIndex !== 0) {
            // Move the matched result to 1st position (LRU)
            this._entries.splice(matchingIndex, 1);
            this._entries.unshift(matchingEntry);
        }
        return { ...matchingEntry };
    }
}
