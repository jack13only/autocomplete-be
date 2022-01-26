module.exports = {
  createAutoComplete(data) {
    const binarySearch = new BinarySearch(data);
    return (prefix) => binarySearch.search(prefix);
  },
};

class BinarySearch {
  constructor(array) {
    this.wordsArray = array;
  }

  search(prefix) {
    if (!prefix) return [];
    let foundElement = -1;
    let firstElement = 0;
    let lastElement = this.wordsArray.length - 1;
    const lowerPrefix = prefix.toLowerCase();

    while (foundElement === -1 && firstElement <= lastElement) {
      const centralElement = Math.floor((firstElement + lastElement) / 2);
      const wordPart = this.wordsArray[centralElement].slice(0, lowerPrefix.length).toLowerCase();
      if (wordPart === lowerPrefix) foundElement = centralElement;
      else if (wordPart > lowerPrefix) lastElement = centralElement - 1;
      else firstElement = centralElement + 1;
    }
    if (foundElement !== -1) {
      const output = [this.wordsArray[foundElement]];
      this.searchLeft(lowerPrefix, foundElement, output);
      this.searchRight(lowerPrefix, foundElement, output);
      return output;
    }
    return [];
  }

  searchLeft(prefix, startIndex, output) {
    while (--startIndex >= 0 && this.startsWithIgnoreCase(this.wordsArray[startIndex], prefix)) {
      output.unshift(this.wordsArray[startIndex]);
    }
  }

  searchRight(prefix, startIndex, output) {
    while (++startIndex < this.wordsArray.length && this.startsWithIgnoreCase(this.wordsArray[startIndex], prefix)) {
      output.push(this.wordsArray[startIndex]);
    }
  }

  startsWithIgnoreCase(word, prefix) {
    return word.toLowerCase().startsWith(prefix);
  }
}
