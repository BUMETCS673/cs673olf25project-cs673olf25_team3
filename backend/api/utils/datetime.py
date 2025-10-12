# Framework-generated: 0%
# Human-written: 0%
# AI-generated: 100% 

from datetime import datetime, timezone

def parse_datetime(dt_str, default=None):
    """
    Parse ISO 8601 string to timezone-aware datetime.
    Returns default if dt_str is None.
    """
    if dt_str:
        # Replace 'Z' with '+00:00' for UTC parsing
        return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
    return default

def parse_datetime_utc(dt_str, default=None):
    """
    Parse ISO 8601 string to a timezone-aware UTC datetime.
    Returns default if dt_str is None.
    """
    if dt_str:
        # Convert "Z" to "+00:00" for Python ISO parsing
        return datetime.fromisoformat(dt_str.replace("Z", "+00:00")).astimezone(timezone.utc)
    return default
