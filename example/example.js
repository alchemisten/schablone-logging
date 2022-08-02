var logger = alcm.logger.LoggerFactory({
    environment: 'local',
});

logger.trace("This is a trace message");
logger.debug("This is a debug message");
logger.info("This is an info message");
logger.warn("This is a warning");
logger.error("This is an error", { error: new Error('The error') });
logger.fatal("This is a fatal error", { error: new Error('The fatal error') });



logger.info('Option demo', {
    objects: [{ carl: 'bob' }, { edith: 'sue' }],
    error: new Error('Shit happened'),
    tags: ['Log 4 Life','Bob'],
    meta: {
        application: 'The example page'
    },
    callback: function(level, message, meta, error) {
        console.log('I am the callback, this is what I have: ', level, message, meta, error);
    }
});
