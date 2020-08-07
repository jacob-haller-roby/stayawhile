export default {
    log: (...args) => console.log(...args),
    debug: (...args) => !!process.env.IS_DEVELOPMENT && console.log(...args) && console.trace(),
    error: (...args) => console.error(...args)
}