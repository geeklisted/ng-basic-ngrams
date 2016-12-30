/**
 *
 * @author Chris Simons
 */

/**
 * Represents a series of N-grams of length (_nGramlength).
 * @param _nGramLength the N-grams to be stored in this object.
 * @constructor
 */
function NGramSegment(_nGramLength) {

    if (_nGramLength === undefined) {
        return;
    }

    this.nGramLength = _nGramLength;
    this.ngrams = new Object();
};

/**
 * Returns all current N-grams in this segment, unsorted.
 * @returns {Array}
 */
NGramSegment.prototype.getNGrams = function(_sorted) {

    if (_sorted) {
        return this.sortByAlpha();
    }
    return this.ngrams;
};

/**
 * Adds an N-gram word to this segment.
 * @param _word the texutal word to add.
 */
NGramSegment.prototype.addNGramWord = function(_word) {
    if (this.ngrams) {
        var existingNGram = this.containsWord(_word);
        if (existingNGram) {
            existingNGram.addOccurrence();
        } else {
           this.ngrams[_word] = new NGram(_word);
        }
    }
};

/**
 * Returns the N-grams associated with this segment sorted alphabetically.
 * @returns {*}
 */
NGramSegment.prototype.sortByAlpha = function() {

    // all of the N-grams/words contained in this segment
    var keyWords = Object.keys(this.ngrams);

    // sort the N-grams/words
    keyWords.sort();

    // we will return a new object that is sorted by N-gram
    var sortedObject = Object();

    for ( var i = 0; i < keyWords.length; i++) {
        var key = keyWords[i];
        sortedObject[key] = this.ngrams[key];
    }

    return sortedObject;
};

/**
 * Determines if the current NGramSegment already contains an N-gram that matches the provided word.
 * @param _nGramToMatch the word, or n-gram, to check for existence
 * @returns {*}
 */
NGramSegment.prototype.containsWord = function(_nGramToMatch) {
    if (this.ngrams) {
        // traverse through all of the keys in N-grams associated with this segment
        for (var keyWord in this.ngrams) {
            var ngram = this.ngrams[keyWord];

            if (ngram && ngram.getWord().match(_nGramToMatch)) {
                return ngram;
            }
        }
    }
    return undefined;
}

/**
 * From Wikipedia: "...an n-gram is a contiguous sequence of n items from a given sequence of text or speech."
 * @param _word the textual word, or n-gram, to add.
 * @constructor
 */
var NGram = function(_word) {

    if (!_word) {
        return;
    }
    this.word = _word;
    this.frequency = 1;
};

/**
 * Adds an occurrence for this word.
 */
NGram.prototype.addOccurrence = function() {
    this.frequency++;
};

/**
 * Returns the textual word associated with this NGram.
 * @returns {*}
 */
NGram.prototype.getWord = function() {
    return this.word;
};

/**
 * Returns the number of occurrences of this NGram.
 * @returns {*}
 */
NGram.prototype.getOccurrences = function() {
    return this.frequency;
};

