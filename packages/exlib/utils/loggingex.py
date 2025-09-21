import logging
from logging.handlers import TimedRotatingFileHandler
import os


def getTimeRotatingLogger(log_path, when, interval, logger_name=None, log_level=logging.INFO):
    logger = logging.getLogger(logger_name)
    logger.setLevel(log_level)

    print("Create log directories: {}".format(log_path))
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    
    handler = TimedRotatingFileHandler(
        log_path,
        when=when,
        interval=interval,
        backupCount=5)
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(module)s: %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger
