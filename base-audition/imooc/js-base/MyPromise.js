/**
 * @description 手写promise
 */
class MyPromise {
  state = 'pending';
  value = undefined;
  reason = undefined;
  resolveCallbacks = [];
  rejectCallbacks = [];
  constructor(fn) {
    const resolveHandler = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.resolveCallbacks.forEach((resFn) => resFn(this.value));
      }
    };
    const rejectHandler = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.rejectCallbacks.forEach((rejFn) => rejFn(this.reason));
      }
    };
    try {
      fn(resolveHandler, rejectHandler);
    } catch (error) {
      rejectHandler(error);
    }
  }
  then(fn1, fn2) {
    fn1 = typeof fn1 === 'function' ? fn1 : (v) => v;
    fn2 = typeof fn2 === 'function' ? fn2 : (e) => e;
    if (this.state === 'pending') {
      return new MyPromise((resolve, reject) => {
        this.resolveCallbacks.push(() => {
          try {
            const newVal = fn1(this.value);
            resolve(newVal);
          } catch (error) {
            reject(error);
          }
        });
        this.rejectCallbacks.push(() => {
          try {
            const newReason = fn2(this.reason);
            reject(newReason);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
    if (this.state === 'fulfilled') {
      return new MyPromise((resolve, reject) => {
        try {
          const newVal = fn1(this.value);
          resolve(newVal);
        } catch (error) {
          reject(error);
        }
      });
    }
    if (this.state === 'rejected') {
      return new MyPromise((resolve, reject) => {
        try {
          const newReason = fn2(this.reason);
          reject(newReason);
        } catch (error) {
          reject(error);
        }
      });
    }
  }
  catch(errfn) {
    return this.then(null, errfn);
  }
}
MyPromise.resolve = function (value) {
  return new MyPromise((resolve, reject) => resolve(value));
};

MyPromise.resolve = function (reason) {
  return new MyPromise((resolve, reject) => reject(reason));
};

MyPromise.all = function (promiseList = []) {
  const p1 = new MyPromise((resolve, reject) => {
    const result = [];
    const length = promiseList.length;
    let resolveCount = 0;
    promiseList.forEach((p) => {
      p.then((data) => {
        result.push(data);
        resolveCount++;
        if (resolveCount === length) {
          resolve(result);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  });
  return p1;
};

MyPromise.race = function (promiseList = []) {
  let resolved = false;
  const p1 = new MyPromise((resolve, reject) => {
    promiseList.forEach((p) => {
      p.then((data) => {
        if (!resolved) {
          resolve(data);
          resolved = true;
        }
      }).catch((err) => {
        {
          reject(err);
        }
      });
    });
  });
  return p1;
};
