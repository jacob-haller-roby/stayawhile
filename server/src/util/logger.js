export default {
    log: (...args) => console.log(...args),
    debug: (...args) => !!process.env.IS_DEVELOPMENT && console.log(...args),
    error: (...args) => console.error(...args)
}