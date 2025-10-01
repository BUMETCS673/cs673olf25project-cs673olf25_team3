# Framework-generated: 0%
# Human-written: 50%
# AI-generated: 50%


from django.db import connections


def _unwrap_db(possible_db):
    """Unwrap several layers that django-mongodb-backend may return.

    The backend sometimes returns an OperationDebugWrapper (or similar)
    that holds the real pymongo Database object on attributes like
    `wrapped`, `database`, or `db`. Try the common ones and return the
    first real object we find.
    """
    # common attribute names that wrap the real DB
    for attr in ('wrapped', 'database', 'db', '_database'):
        if hasattr(possible_db, attr):
            possible_db = getattr(possible_db, attr)

    return possible_db


def get_collection(collection_name):
    """Return a pymongo Collection from the default Django DB connection.

    This function is defensive: it unwraps debug wrappers used by
    django-mongodb-backend and supports both db[name] and
    db.get_collection(name) access patterns.
    """
    db = connections['default'].get_database()
    db = _unwrap_db(db)

    # Prefer the explicit get_collection API if available
    if hasattr(db, 'get_collection'):
        collection = db.get_collection(collection_name)
    else:
        # Fall back to mapping-style access (db[name]) and handle
        # wrappers that expose the underlying collection on `_collection`.
        try:
            collection = db[collection_name]
        except Exception:
            # Try unwrapping one more time and then attempt get_collection
            db = _unwrap_db(db)
            if hasattr(db, 'get_collection'):
                collection = db.get_collection(collection_name)
            else:
                # As a last resort try attribute access
                collection = getattr(db, '_collection', None)
                if collection is None:
                    raise

    # If the collection itself is wrapped (OperationDebugWrapper), unwrap it
    if hasattr(collection, '_collection'):
        collection = collection._collection

    return collection
