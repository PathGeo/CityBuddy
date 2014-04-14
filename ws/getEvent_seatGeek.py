import requests, json, time, cgi
from datetime import datetime, timedelta
from pymongo import MongoClient
from cityBuddy import *
col=MongoClient().cityBuddy.event

print ''

fields=cgi.FieldStorage

#functions==================================================================
#get value from URL parameters
def getURLValue(parameter):
        return none if parameter not in fields else fields[parameter].value

#===========================================================================

#LOG
LOGGER=getLogger(logName='getEvent_seatGeek.log')



#send a request to seatgeek to obtain events at San Diego central point within 100 miles
url='http://api.seatgeek.com/2/events?per_page=10000&page=1&'
lat='32.715'
lon='-117.1625'
range='40mi'  #or kilometer with 'km'
url=url+'lat='+lat+'&lon='+lon+'&range='+range


#log
LOGGER.info("-"*60)
LOGGER.info("START GETTING EVENTS FROM SEATGEEK  AT " + str(datetime.now()))
LOGGER.info("-"*60)


res=requests.get(url)
j=res.json()


#log the meta in the result
LOGGER.info(json.dumps(j['meta']))

#parse each event
deletes=['time_tbd', 'links', 'stats', 'date_tbd', 'score', 'datetime_tbd']
results=[]
dates=["datetime_local", "visible_until_utc", "datetime_utc","created_at","announce_date"]
splits=[]
for evt in j['events']:

    try:
        #if evt.created_at larger than yesterday
        timeCreatedAt=time.mktime(datetime.strptime(evt['created_at'], '%Y-%m-%dT%H:%M:%S').timetuple())
        timeYesterday=time.mktime((datetime.utcnow() - timedelta(days=1)).timetuple())

        #timeYesterday=0

        if(timeCreatedAt-timeYesterday>=0):
            
            #delete attribute in evt object
            for d in deletes:
                del evt[d]

            #change attribute
            evt['categories']=evt['taxonomies']
            del evt['taxonomies']

            evt['venue']['latlon']=evt['venue']['location']
            del evt['venue']['location']


            #add attribute
            evt['source']='seatGeek'
            evt['reviews']={}
            evt['access_utc']=str(datetime.utcnow())

            #change date format
            for date in dates:
                splits=evt[date].replace("T", " ")

                
            results.append(evt)
        
        
    except Exception, e:
        #log how many new events
        LOGGER.info('[ERROR] Parsing events from Seatgeek results: '+ str(e))

        print '[ERROR] Parsing events from Seatgeek results'
        print json.dumps(str(e))


#save in mongodb
if(len(results)!=0):
    #log how many new events
    LOGGER.info('There are ' + str(len(results)) + ' events added in the mongodb')
    
    col.insert(results)
    print 'Successfully get event from SeatGeek at ' + str(datetime.now())


else:
    #log 
    LOGGER.info('There are 0 events added in the mongodb')
    print '[ERROR] No results'



        


