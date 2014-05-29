import requests, json, time, cgi, dateutil.parser, re, pytz
from datetime import datetime, timedelta
from pymongo import MongoClient
from cityBuddy import *
col=MongoClient().cityBuddy.event
dateParser=dateutil.parser

print ''


#LOG
LOGGER=getLogger(logName='getEvent_SDConventionCenter.log')



#send a request to KIMONO to collect events from SD Convention center
url='http://www.kimonolabs.com/api/7nio609i?apikey=bcd2e8fd4d5d965561a3b3ac6397d0af'


#log
LOGGER.info("-"*60)
LOGGER.info("START GETTING EVENTS FROM SEATGEEK  AT " + str(datetime.now()))
LOGGER.info("-"*60)


res=requests.get(url)
j=res.json()


#log the meta in the result
LOGGER.info(json.dumps(j))

#parse each event
results=[]
event={}
category={}

#timezone
utc=pytz.timezone("UTC")
local=pytz.timezone("America/Los_Angeles")


for evt in j['results']['collection1']:

    try:
        event=createEvent()
        category=createCategory()
        
        event['title']=evt['title']
        event['open']= "Private" if evt['openToPublic']=='No' else 'Public'
        event['attendance']=evt['attendance']
        event['source']='SD Convention Center'

        #date
        dates=re.split('\xa0-\xa0',evt['date'])
        event['datetime_start_local']=dateParser.parse(dates[0])
        event['datetime_end_local']=dateParser.parse(dates[1])

      
        
        #change timezone
        event['datetime_start_utc']=local.localize(event["datetime_start_local"]).astimezone(utc)
        event['datetime_end_utc']=local.localize(event["datetime_end_local"]).astimezone(utc)
        

        category['name']=evt['type']
        event['categories'].append(category)

        results.append(event)
    except Exception, e:
        #log how many new events
        LOGGER.info('[ERROR] Parsing events from SD Convention Center results: '+ str(e))

        print '[ERROR] Parsing events from SD Convention Center results'
        print json.dumps(str(e))


#save in mongodb
if(len(results)!=0):
    #log how many new events
    LOGGER.info('There are ' + str(len(results)) + ' events added in the mongodb')

    #print results
    #print json.dumps(results)
    #col.insert(results)
    print 'Successfully get event from SD Convention center at ' + str(datetime.now())


else:
    #log 
    LOGGER.info('There are 0 events added in the mongodb')
    print '[ERROR] No results'



        


