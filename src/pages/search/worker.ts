self.onmessage = function (e: MessageEvent<number>) {
    const iterations = e.data;
    const primes: number[] = [];
    const startTime = performance.now();

    for (let i = 2; i < iterations; i++) {
        let isPrime = true;
        for (let j = 2; j < i; j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) primes.push(i);
    }
    
    const timeTaken = performance.now() - startTime;
    self.postMessage({ primes, timeTaken });
};
