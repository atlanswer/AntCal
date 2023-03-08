from functools import wraps


def add_to_class(cls: type):
    def decorator(method):
        @wraps(method)
        def add_this(*args, **kwargs):
            return method(*args, **kwargs)

        setattr(cls, method.__name__, add_this)
        return method

    return decorator
