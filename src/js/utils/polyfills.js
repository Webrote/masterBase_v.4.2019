// Polyfills for old brousers
// 
// 1. NodeList.prototype.forEach()
// 2. closest()
// 3. Добавляем класс ms в body для Ie11
// 4. Array.from

// 1.Добавляенм поддержку NodeList.prototype.forEach()
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// 2. Добавляенм поддержку .closest()
if (!Element.prototype.closest) {

	// реализуем
	Element.prototype.closest = function(css) {
		var node = this;

		if (!Element.prototype.matches) {
			Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
		}

		while (node) {
			if (node.matches(css)) return node;
			else node = node.parentElement;
		}
		return null;
	};
}

// 3. Добавляем класс ms в body для Ie11
function getInternetExplorerVersion() {
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
	} else if (navigator.appName == 'Netscape') {
		var ua = navigator.userAgent;
		var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
	}
	return rv;
}

if (getInternetExplorerVersion() !== -1) {
	document.body.classList.add('ms');
}


// 4. Добавляенм поддержку Array.from
if (!Array.from) {
	Array.from = (function() {
		var toStr = Object.prototype.toString;
		var isCallable = function(fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function (value) {
			var number = Number(value);
			if (isNaN(number)) { return 0; }
			if (number === 0 || !isFinite(number)) { return number; }
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function (value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		// Свойство length метода from равно 1.
		return function from(arrayLike/*, mapFn, thisArg */) {
			// 1. Положим C равным значению this.
			var C = this;

			// 2. Положим items равным ToObject(arrayLike).
			var items = Object(arrayLike);

			// 3. ReturnIfAbrupt(items).
			if (arrayLike == null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}

			// 4. Если mapfn равен undefined, положим mapping равным false.
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				// 5. иначе
				// 5. a. Если вызов IsCallable(mapfn) равен false, выкидываем исключение TypeError.
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

				// 5. b. Если thisArg присутствует, положим T равным thisArg; иначе положим T равным undefined.
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			// 10. Положим lenValue равным Get(items, "length").
			// 11. Положим len равным ToLength(lenValue).
			var len = toLength(items.length);

			// 13. Если IsConstructor(C) равен true, то
			// 13. a. Положим A равным результату вызова внутреннего метода [[Construct]]
			//     объекта C со списком аргументов, содержащим единственный элемент len.
			// 14. a. Иначе, положим A равным ArrayCreate(len).
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);

			// 16. Положим k равным 0.
			var k = 0;
			// 17. Пока k < len, будем повторять... (шаги с a по h)
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			// 18. Положим putStatus равным Put(A, "length", len, true).
			A.length = len;
			// 20. Вернём A.
			return A;
		};
	}());
}


/////////////////////////////////////
// Добавляенм поддержку Object.keys() //
/////////////////////////////////////
if (!Object.keys) {
	Object.keys = (function() {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],

		dontEnumsLength = dontEnums.length;

		return function(obj) {
			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
		 		for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1. 
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

// Node.remove()
(function() {
  var arr = [window.Element, window.CharacterData, window.DocumentType];
  var args = [];

  arr.forEach(function (item) {
    if (item) {
      args.push(item.prototype);
    }
  });

  // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
  (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('remove')) {
        return;
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          this.parentNode.removeChild(this);
        }
      });
    });
  })(args);
})();