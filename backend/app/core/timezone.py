from datetime import datetime
from zoneinfo import ZoneInfo

TZ = ZoneInfo("Europe/Berlin")


def get_timezone():
    return datetime.now(TZ)
