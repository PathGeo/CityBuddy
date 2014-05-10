from pymongo import MongoClient
import dateutil.parser
import pytz

parser=dateutil.parser

col=MongoClient().cityBuddy.event

evts=col.find({"source":"SD Convention Center"})

utc=pytz.timezone("UTC")
local=pytz.timezone("America/Los_Angeles")
parser=dateutil.parser

#deletes=["datetime_start", "datetime_end"]
#dates=["datetime_start_local", "datetime_start_utc", "datetime_end_local", "datetime_end_utc"]


categories={
    "sports":{
        "id":"1000000",
        "parent_id":None,
        "name":"sports"
    },
    "concert":{
        "id":"2000000",
        "parent_id":None,
        "name":"music"
    },
    "theater":{
        "id":"3000000",
        "parent_id":None,
        "name":"art&culture"
    },
    "community":{
        "id":"4000000",
        "parent_id":None,
        "name":"community"
    },
    "convention":{
        "id":"5000000",
        "parent_id":None,
        "name":"convention"
    }
}

for evt in evts:
    evt['p_themes']=[categories['convention']]

    '''
    category=evt['categories'][0]

    if category and 'name' in category:
        if category['name'] in categories:
            evt['p_themes'].append(categories[category['name']])
    '''
    
    #print evt['p_themes']

    col.save(evt)
    
    '''
    evt["datetime_start_local"]=evt["datetime_start"]
    evt["datetime_end_local"]=evt["datetime_end"]

    #change to utc
    evt["datetime_start_utc"]=local.localize(parser.parse(evt["datetime_start_local"]), is_dst=None).astimezone(utc).strftime("%Y-%m-%d %H:%M:%S")
    evt["datetime_end_utc"]=local.localize(parser.parse(evt["datetime_end_local"]), is_dst=None).astimezone(utc).strftime("%Y-%m-%d %H:%M:%S")

  
    print evt["datetime_start_local"]
    print evt["datetime_start_utc"]
    print '-'*10
    print evt["datetime_end_local"]
    print evt["datetime_end_utc"]
    print '='*60
    


    for delete in deletes:
        del evt[delete]
    

    col.save(evt)
    '''
