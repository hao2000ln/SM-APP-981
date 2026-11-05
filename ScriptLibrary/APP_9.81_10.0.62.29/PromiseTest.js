var Promise = lib.Promise.require();

// example
var multiplyMeAsync = function (val) {
    var promise = new Promise();
    promise.fulfillPromise(val * 2);

    return promise;
};

multiplyMeAsync(2)
    .then(function (value) {
    print(value);
});


// another error example
var alertResult = function (value) {
    print(value);
};

var onError = function(errorMsg) {
 print(errorMsg);
};

var divideAsync = function (val) {
    var promise2 = new Promise();
    if (val == 0) {
        promise2.rejectPromise("cannot divide by zero");
    }
    else{
        promise2.fulfillPromise(1 / val);
    }
    return promise2;
};

multiplyMeAsync(0)
  .then(divideAsync)
  .then(undefined, onError);