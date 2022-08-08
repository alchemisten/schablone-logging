var logger = alcm.logger.LoggerFactory({
    environment: 'local',
    globalLogOptions: {
        callback: function(level, message, meta, error) {
            console.log('I am the global callback, this is what I have: ', level, message, meta, error);
        },
        meta: {
            global: true
        },
        tags: ['Global Tag']
    }
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
        log: 'The example page'
    },
    callback: function(level, message, meta, error) {
        console.log('I am a message callback, this is what I have: ', level, message, meta, error);
    }
});



var childLogger = logger.withOptions({
    environment: 'staging',
    environmentLevelMap: {
        trace: 'staging'
    },
    globalLogOptions: {
        callback: function(level, message, meta, error) {
            console.log('I am the child callback, this is what I have: ', level, message, meta, error);
        },
        meta: {
            child: true,
        },
        tags: ['Child Tag']
    }
});

childLogger.trace("This is a trace message");
childLogger.debug("This is a debug message");
childLogger.info("This is an info message");
childLogger.warn("This is a warning");
childLogger.error("This is an error", { error: new Error('The error') });
childLogger.fatal("This is a fatal error", { error: new Error('The fatal error') });

childLogger.info('Option demo', {
    objects: [{ carl: 'bob' }, { edith: 'sue' }],
    error: new Error('Shit happened'),
    tags: ['Log 4 Life','Bob'],
    meta: {
        log: 'The example page'
    },
    callback: function(level, message, meta, error) {
        console.log('I am a child message callback, this is what I have: ', level, message, meta, error);
    }
});
