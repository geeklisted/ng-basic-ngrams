'use strict'
/**
 *
 * @purpose Demonstrate parsing of an unstructured textual document (aka n-grams).
 *
 * @author Chris Simons
 * Assumptions:
 *      1. Uniqueness is based on the word regardless of case.
 * Notes:
 *      1. Initially I did not include specialized objects (NGramSegment, NGram) but found that
 *      it might make sense to define a data structure of sorts.
 *      2. I chose JavaScript as, in my opinion, it's a fast and efficient way to tackle a one-off exercise such as this
 *      and it provides all of the basics a developer needs.  Most of my development time is split between JavaScript
 *      and Java.
 *      3. Most of the work I perform in JavaScript is done via Angular.
 *      4. I was a little confused by the example output shown in the exercise regarding how the outcome
 *      should be sorted but chose to go by the text/description versus the example output.
 *      5. ECMA does not guarantee that properties will be sorted alphabetically in an Object, hence the sortByAlpha()
 *      function.
 *
 */
angular.module('NGramsApp', ['NGramsApp.Main']);

/**
 * NGramCtrl processes, parses, and updates our N-gram results for the user.
 */
angular.module('NGramsApp.Main', [])
    .controller('MainCtrl', ['$scope', '$log', function($scope, $log) {

        /* what we use to split up the document */
        var BASE_DELIMITER = " ";           // white space

        /* our array of phrases, which are associated to an object */
        var ngrams = new Object();

        /* our textual document; defaults to 'a good puzzle is a fun puzzle' from coding exercise */
        $scope.textInput = "a good puzzle is a fun puzzle";

        /* the maximum length n-gram to be considered; defaults to 2 */
        $scope.maxLength = 2;

        /* whether results should be sorted alphabetically */
        $scope.sorted = true;

        /* our object of NGramSegment results, which will be displayed via Angular */
        $scope.results = {};

        /**
         * Parses the inputted document by examining N-grams contained within the document.
         * When finished, results are post-processed (i.e. sorted and counted) prior to displaying
         * in the simple data-bound Angular page.  Note: Angular's ng-repeat could have been used to sort N-grams.
         */
        $scope.processDocument = function() {

            if (!$scope.textInput || !$scope.maxLength) {
                $log.warn('Unable to process document; text input is null or blank.');
            }

            // a copy of the inputted string with beginning and end trimmed
            var document = $scope.textInput.trim();

            // strip out special characters
            document = document.replace(/[^\w\s]/gi, '');

            // make everything lower-case
            document = document.toLowerCase();

            var m = $scope.maxLength;

            // reset our results from any previous processing
            resetResults();

            // convert our document of words into an array for easier processing
            var words = document.split(BASE_DELIMITER);

            var mIndex = 1;         // start at 1, min 'ngrams' is 1

            // traverse through our array of words as many as 'm' times
            while (mIndex <= m) {
                // traverse through each word, ensuring that the each new 'gram'
                // fully meets 'm' and does not include danging words
                for (var wIndex = 0; wIndex < words.length && wIndex + mIndex <= words.length; wIndex++) {

                    // take the word at this element, 'wIndex', and get the next 'mIndex' words
                    var gram = words.slice(wIndex, wIndex + mIndex);

                    // 'slice()' returns an Array; so convert it to a String and replace ',' with spaces
                    gram = gram.toString();
                    gram = gram.replace(/,/g, ' ');

                    // if this is our first pass of N-words of length 'm', create a new segment
                    if (!ngrams[mIndex]) {
                        ngrams[mIndex] = new NGramSegment(mIndex);
                    }
                    // add the 'ngram' to our Array of words that belong to 'm' (i.e. N-gram length)
                    // the NGramSegment will determine if the word already exists and act appropriately
                    // see (objects.js)
                    ngrams[mIndex].addNGramWord(gram);
                }

                mIndex++;
            }

            // when finished, copy our ngrams into scope variable for display
            angular.copy(ngrams, $scope.results);

            // just some debugging
            $log.info('Results', $scope.results);

        };

        /**
         * Finds the frequency of a given word within an N-gram segment.
         * @param _mKey the N-gram key, i.e. 'm' or length of N-grams
         * @param _word the word to be counted
         */
        $scope.getOccurrencesOfWordBySegment = function(_mKey, _word) {

            if (!_mKey || !_word) {
                $log.warn('getFrequencyOfWordsBySegment', 'key or word is undefined');
            }

            if (!ngrams[_mKey]) {
                $log.warn('getFrequencyOfWordsBySegment', 'key', _mKey, 'does not exist');
            }

            var occurrences = 0;

            for (var i = 0; i < ngrams[_mKey].length; i++) {
                if (ngrams[_mKey][i].match(_word)) {
                    occurrences++;
                }
            }

            return occurrences;

        }

        /**
         * Resets our results and ngrams objects.
         */
        var resetResults = function() {
            $scope.results = {};
            ngrams = new Object();
        }

}]);