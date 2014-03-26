import requests, json
from datetime import datetime


print ''


#send a request to seatgeek to obtain events at San Diego central point within 100 miles
url='http://api.seatgeek.com/2/events?'
lat='32.715'
lon='-117.1625'
range='100mi'  #or kilometer with 'km'
url=url+'lat='+lat+'&lon='+lon+'&range='+range

res=requests.get(url)
j=res.json()



#parse each event
deletes=['time_tbd', 'links', 'stats', 'date_tbd', 'score', 'datetime_tbd']
results=[]
for evt in j['events']:

    try:
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

        results.append(evt)

        
    except Exception, e:
	print '[ERROR] Parsing events from Seatgeek results'
	print json.dumps(str(e))


#save in mongodb
from pymongo import MongoClient
col=MongoClinet().cityBuddy.event
col.insert(results)




print json.dumps(results)


