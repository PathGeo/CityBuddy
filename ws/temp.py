from pymongo import MongoClient
import dateutil.parser
import pytz

parser=dateutil.parser

col=MongoClient().cityBuddy.event

evts=col.find({"source":"SanDiegoReader"})

utc=pytz.timezone("UTC")
local=pytz.timezone("America/Los_Angeles")
parser=dateutil.parser

deletes=["datetime_start", "datetime_end"]
#dates=["datetime_local", "visible_until_utc", "datetime_utc", "created_at", "announce_date"]


for evt in evts:
    evt["datetime_start_local"]=evt["datetime_start"]
    evt["datetime_end_local"]=evt["datetime_end"]

    #change to utc
    evt["datetime_start_utc"]=local.localize(parser.parse(evt["datetime_start_local"]), is_dst=None).astimezone(utc).strftime("%Y-%m-%d %H:%M:%S")
    evt["datetime_end_utc"]=local.localize(parser.parse(evt["datetime_end_local"]), is_dst=None).astimezone(utc).strftime("%Y-%m-%d %H:%M:%S")

    '''
    print evt["datetime_start_local"]
    print evt["datetime_start_utc"]
    print '-'*10
    print evt["datetime_end_local"]
    print evt["datetime_end_utc"]
    print '='*60
    

'''
    for delete in deletes:
        del evt[delete]
    

    col.save(evt)
    
