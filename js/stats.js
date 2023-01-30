
function swap(a, b) { return [b, a]; }
function sort(list) { return list.sort(function(a, b) { return a - b; }); }
function round(x, a=0) { return Math.round(x * Math.pow(10, a)) / Math.pow(10, a); }
//function min(a, b) { return a <= b ? a : b; }
//function max(a, b) { return a >= b ? a : b; }
function sgn(a) { return a / abs(a) };
function odd(x) { return (x % 2) == 1; }
function even(x) { return (x % 2) == 0; }
function ln(x) { return Math.log(x); }
function log(x) { return Math.log(x) / Math.log(10); }

/******************************************************************************
 * Finds the minimum value in an array of numbers.
 * 
 * Inputs:
 *   list - an array of numbers
 */

export function min(list) {
    var min = Number.MAX_VALUE;
    for(var i = 0; i < list.length; i++) {
        if(list[i] < min) {
            min = list[i];
        }
    }
    return min;
};


	///////////////////////////////////////////////////////////////////////////////
	//  Finds the maximum value in an array of numbers.
	///////////////////////////////////////////////////////////////////////////////

export function max(list) {
    var max = Number.MIN_VALUE;
    for(var i = 0; i < list.length; i++) {
        if(list[i] > max) {
            max = list[i];
        }
    }
    return max;
};

	///////////////////////////////////////////////////////////////////////////////
	//  Calculates the value of the median in an array
	///////////////////////////////////////////////////////////////////////////////

export function median(list) {
    var a = sort(list);
    var mid = a.length / 2;
    var med = MINDOUBLE;
    if (a.length % 2 == 0) {
        med = (a[mid - 1] + a[mid]) / 2;
    } else {
        med = a[Math.floor(mid)];
    }
    return med;
};

/******************************************************************************
 * Calculates the mode of a set of data, returns an array in case there are
 * multiples.
 * 
 */

export function mode(list) {

}

/******************************************************************************
 * Finds the highest frequency of any data items within a data set. This is
 * similar to the mode, but it returns the value of the frequency instead of
 * the value(s) that occur the most.
 */
export function max_frequency(list) {
    let counts = {};
    for (let value of list) {
        if (value in counts) {
            counts[value] += 1;
        } else {
            counts[value] = 1;
        }
    }
    let max = 0;
    for (let value of Object.values(counts)) {
        if (value > max) {
            max = value;
        }
    }
    return max;
}

	///////////////////////////////////////////////////////////////////////////////
	//  Calculates q1 for the values of the items in an array
	///////////////////////////////////////////////////////////////////////////////

export function q1(list) {
    var a = sort(list);
    var mid = a.length / 2;
    return stats.median(a.slice(0, Math.floor(mid)));
};

	//////////////////////////////////////////////////////////////////////////////
	//  Calculates q1 for the values of the items in an array
	//////////////////////////////////////////////////////////////////////////////

export function q3(list) {
    var a = sort(list);
    var mid = a.length / 2;
    return stats.median(a.slice(Math.ceil(mid), a.length));
};

	///////////////////////////////////////////////////////////////////////////
	//  Computes the sum of an array of numbers.
	///////////////////////////////////////////////////////////////////////////

export function sum(list) {
    var s = 0;
    for(var i = 0; i < list.length; i++) {
        s += list[i];
    }
    return s;
}

	//////////////////////////////////////////////////////////////////////////////
	//  Computes the sum of the squares of an array of numbers.
	//////////////////////////////////////////////////////////////////////////////

export function	sumofsqr(list) {
    var s = 0;
    for(var i = 0; i < list.length; i++) {
        s += sqr(list[i]);
    }
    return s;
};

	///////////////////////////////////////////////////////////////////////////
	//  Calculates the arithmetic mean of a set of values.
	///////////////////////////////////////////////////////////////////////////

export function mean(list) {
	return stats.sum(list) / list.length;
};

	///////////////////////////////////////////////////////////////////////////
	//  Calculates the arithmetic mean of a set of values,
	//   subject to an array of frequencies.
	///////////////////////////////////////////////////////////////////////////

export function	wmean(list, freq) {

    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }

    var s = 0;
    for(var i = 0; i < list.length; i++) {
        s += list[i] * freq[i];
    }
    return s / stats.sum(freq);

};

	//////////////////////////////////////////////////////////////////////////////
	//  Calculates the sample standard deviation of a set of values.
	//////////////////////////////////////////////////////////////////////////////

export function	stdev(list) {
    var mu = stats.mean(list);
    var ssd = 0; // sum of squared deviations
    for(var i = 0; i < list.length; i++) {
        ssd += sqr(list[i] - mu);
    }
    return sqrt(ssd / (list.length - 1));
};

	///////////////////////////////////////////////////////////////////////////////
	//  Calculates the population standard deviation of a set of values.
	///////////////////////////////////////////////////////////////////////////////

export function stdevp(list) {
    var mu = stats.mean(list);
    var ssd = 0; // sum of squared deviations
    for(var i = 0; i < list.length; i++) {
        ssd += sqr(list[i] - mu);
    }
    return sqrt(ssd / list.length);
};

	///////////////////////////////////////////////////////////////////////////////
	//  Calculates the number of items in a frequency table. Allows for
	//.   non-integer frequencies.
	///////////////////////////////////////////////////////////////////////////////

export function wn(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    return stats.sum(freq);
};

	///////////////////////////////////////////////////////////////////////////////
	//  Finds the weighted minimum value in an array of numbers.
	///////////////////////////////////////////////////////////////////////////////

export function wmin(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    return stats.min(list);
};

	///////////////////////////////////////////////////////////////////////////////
	//  Finds the maximum value in an array of numbers.
	///////////////////////////////////////////////////////////////////////////////

export function wmax(list, freq) {

    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    return stats.max(list);
};

	///////////////////////////////////////////////////////////////////////////
	//  Computes the weighted sum of an array of numbers.
	///////////////////////////////////////////////////////////////////////////

export function wsum(list, freq) {

    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }

    var s = 0;
    for(var i = 0; i < list.length; i++) {
        s += list[i] * freq[i];
    }
    return s;
};

	///////////////////////////////////////////////////////////////////////////
	//  Computes a dot product of two sets of numbers, similar to a weighted
	//  sum, but allows for "frequencies" to be negative.
	///////////////////////////////////////////////////////////////////////////

export function innerproduct(list1, list2) {

    if (list1.length != list2.length) {
        return NaN;
    }

    var s = 0;
    for(var i = 0; i < list1.length; i++) {
        s += list1[i] * list2[i];
    }
    return s;
};

	///////////////////////////////////////////////////////////////////////////////
	//  Calculates the weighted median in an array
	///////////////////////////////////////////////////////////////////////////////

export function wmedian(list, freq) {

    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }

    [list, freq] = stats.wsort(list, freq);
    var s = stats.sum(freq);
    var mid = s / 2;
    var csum = 0;
    var index = 0;
    while (csum < mid && index < freq.length) {
        csum += freq[index];
        index += 1;
    }
    return list[index - 1];
};

	///////////////////////////////////////////////////////////////////////////////
	//  Calculates the weighted value of q1 in an array
	///////////////////////////////////////////////////////////////////////////////

export function wq1(list, freq) {

    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }

    [list, freq] = stats.wsort(list, freq);
    var s = stats.sum(freq);
    var mid = s / 2;
    var csum = 0;
    var index = 0;
    while (csum < mid && index < freq.length) {
        csum += freq[index];
        index += 1;
    }
    return stats.wmedian(list.slice(0, index), freq.slice(0, index));
};


	///////////////////////////////////////////////////////////////////////////////
	//  Calculates the weighted value of q1 in an array
	///////////////////////////////////////////////////////////////////////////////

export function wq3(list, freq) {

    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }

    [list, freq] = stats.wsort(list, freq);

    var s = stats.sum(freq);
    var mid = s / 2;
    var csum = 0;
    var index = 0;
    while (csum < mid && index < freq.length) {
        csum += freq[index];
        index += 1;
    }
    return stats.wmedian(list.slice(index, list.length), freq.slice(index, freq.length));
};

	///////////////////////////////////////////////////////////////////////////////
	//  Computes the weighted sum of the squares of an array of numbers.
	///////////////////////////////////////////////////////////////////////////////

export function wsumofsqr(list, freq) {

    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }

    var s = 0;
    for(var i = 0; i < list.length; i++) {
        s += sqr(list[i]) * freq[i];
    }
    return s;
};

	///////////////////////////////////////////////////////////////////////////////
	//  Calculates the weighted sample standard deviation of a set of values.
	///////////////////////////////////////////////////////////////////////////////

export function wstdev(list, freq) {

    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }

    var mu = stats.wmean(list, freq);
    var ssd = 0; // sum of squared deviations
    for(var i = 0; i < list.length; i++) {
        ssd += freq[i] * sqr(list[i] - mu);
    }
    return sqrt(ssd / (stats.wn(list, freq) - 1));
};

	///////////////////////////////////////////////////////////////////////////////
	//  Calculates the weighted population standard deviation of a set of values.
	///////////////////////////////////////////////////////////////////////////////

export function wstdevp(list, freq) {

    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }

    var mu = stats.wmean(list, freq);
    var ssd = 0; // sum of squared deviations
    for(var i = 0; i < list.length; i++) {
        ssd += freq[i] * sqr(list[i] - mu);
    }
    return sqrt(ssd / stats.wn(list, freq));
};

	///////////////////////////////////////////////////////////////////////////////
	//  Computes the linear correlation (Pearson) cofficent for paird data.
	//		@return: NaN - The length of the x and y data sets is different
	//					   or there is not enough data in the data sets.
	///////////////////////////////////////////////////////////////////////////////

export function correlation(x_data, y_data) {

    if(x_data.length != y_data.length) {
        return NaN;
    }

    if(x_data.length < 2) {
        return NaN;
    }

    var sx = stats.sum(x_data);
    var sy = stats.sum(y_data);
    var sxy = 0;
    var sxx = stats.sumofsqr(x_data);
    var syy = stats.sumofsqr(y_data);
    var n = x_data.length;

    for(var i = 0; i < x_data.length; i++) {
        sxy += x_data[i] * y_data[i];
    }

    var r = (n * sxy - sx * sy) / sqrt( (n * sxx - sqr(sx)) * (n * syy - sqr(sy)) );

    return r;
};

	///////////////////////////////////////////////////////////////////////////////
	//  Computes the slope and y-intercept of of the line of best fit for a
	//    set of data.
	//		@return: NaN - The length of the x and y data sets is different
	//					   or there is not enough data in the data sets.
	///////////////////////////////////////////////////////////////////////////////

export function linreg(x_data, y_data) {

    if(x_data.length != y_data.length) {
        return NaN;
    }

    if(x_data.length < 2) {
        return NaN;
    }

    var sx = stats.sum(x_data);
    var sy = stats.sum(y_data);
    var sxy = stats.innerproduct(x_data, y_data);
    var sxx = stats.sumofsqr(x_data);
    var n = x_data.length;

    var m = (n * sxy - sx * sy) / (n * sxx - sqr(sx));
    var b = (sy - m * sx) / n;

    return [m, b];
};

	///////////////////////////////////////////////////////////////////////////////
	//  Expands an array based on a set of frequencies
	//.    @returns NaN if any frequency is negative or the number of frequencies
	//.        does not match the number data items
	///////////////////////////////////////////////////////////////////////////////

export function expandarray(list, freq) {

    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if ((freq[i] < 0) || (Math.floor(freq[i]) != freq[i])) {
            return NaN;
        }
    }

    var newlist = [];
    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < freq[i]; j++) {
            newlist.push(freq[i]);
        }
    }
};

	///////////////////////////////////////////////////////////////////////////////
	//  Sorts two arrays simultaneoulsy by the values in the first array.
	///////////////////////////////////////////////////////////////////////////////

export function wsort(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }

    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }

    var newArray = [];

    for (var i = 0; i < list.length; i++) {
        newArray.push({ 'x' : list[i],  'f' : freq[i] });
    }

    newArray.sort(function(a, b) {
        return ((a.x < b.x) ? -1 : ((a.x == b.x) ? 0 : 1));
    });

    for (var i = 0; i < newArray.length; i++) {
        list[i] = newArray[i].x;
        freq[i] = newArray[i].f;
    }

    return [list, freq];

};