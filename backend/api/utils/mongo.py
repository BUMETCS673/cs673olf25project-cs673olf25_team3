"""
api.db.utils

Helpers for safely retrieving MongoDB collections when using django-mongodb-backend
"""
# Framework-generated: 0%
# Human-written: 50%
# AI-generated: 50%


from django.db import connections


def _unwrap_db(possible_db):
    """
    Unwrap several layers that django-mongodb-backend may return

    django-mongodb-backend sometimes wraps the database in objects like
    OperationDebugWrapper. These often expose the real DB on attributes
    like `wrapped`, `database`, or `db`. This function checks the common
    ones in order and returns the first actual database object found
    """
    # common attribute names that wrap the real DB
    for attr in ('wrapped', 'database', 'db', '_database'):
        if hasattr(possible_db, attr):
            possible_db = getattr(possible_db, attr)

    return possible_db


def get_collection(collection_name):
    """
    Return a pymongo Collection from the default Django DB connection

    Defensive approach:
    - Get the base database object from Django.
    - Unwrap any debug/wrapper layers.
    - Prefer db.get_collection(name), but fall back to db[name].
    - If still wrapped, unwrap the collection itself.
    """
    db = connections['default'].get_database()
    db = _unwrap_db(db)

    # Prefer the explicit get_collection API if available
    if hasattr(db, 'get_collection'):
        collection = db.get_collection(collection_name)
    else:
        # Fall back to mapping-style access (db[name]) and handle
        # wrappers that expose the underlying collection on `_collection`
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
