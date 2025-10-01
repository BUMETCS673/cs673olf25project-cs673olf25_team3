# Framework-generated: 0%
# Human-written: 100%
# AI-generated: 0%

from django.db import connections

def get_collection(collection: str):
    """
    Return a MongoDB collection by name from the default connection.
    """
    db = connections['default'].get_database()
    # return db[collection]
    return db.get_collection(collection)