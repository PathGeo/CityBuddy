

#data structure
def createEvent():
    return {
        "id": "",
        "title": "",
        "announce_date": "",
        "datetime_start_local": "",
        "datetime_start_utc": "",
        "datetime_end_local": "",
        "datetime_end_utc": "",
        "venue": {},
        "short_title": "",
        "categories": [],
	"source":"",
        "performers": [],
        "url": "",
        "reviews": {},
        "source":"",
        "access_utc":"",
        "open":"",
        "attendance":0
}


#create venue
def createVenue():
    return {
            "city": "",
            "name": "",
            "address": "",
            "url": "",
            "country": "",
            "links": [],
            "state": "",
            "postal_code": "",
            "latlon": {
                "lat": None,
                "lon": None
            },
            "timezone": "",
            "id": ""
        }


#create category
def createCategory():
    return {
            "parent_id": None,
            "id": "",
            "name": ""
            }


#create performer
def createPerformer():
    return {
            "name": "",
            "short_name": "",
            "url": "",
            "type": "",
            "image": "",
            "images": {
                "huge": "",
                "medium": "",
                "large": "",
                "small": ""
            },
            "id": ""
        }



#save as xls
def saveDataAsExcel(data, outputFileName, sheetName, columns=None):
	import xlwt

	book = xlwt.Workbook(encoding="UTF-8")
	sheet = book.add_sheet(sheetName)
	
	columns = columns or data[0].keys()
	for colIndx, column in enumerate(columns):
		sheet.write(0, colIndx, column)

	for rowIndx, row in enumerate(data):
		for colIndx, column in enumerate(columns):
			val = row.get(column, '')
			sheet.write(rowIndx+1, colIndx, val)
	
	curDir = path.dirname(path.realpath(__file__))	
	book.save(curDir + "\\xls\\" + outputFileName)

	return curDir + "\\xls\\" + outputFileName



#LOG
def getLogger(logName="log.log"):
	import logging, os
	from os import path
	
	logger = logging.getLogger("log")
	curDir = path.dirname(path.realpath(__file__))
	hdlr = logging.FileHandler(curDir + "\\" + logName)
	formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
	hdlr.setFormatter(formatter)
	logger.addHandler(hdlr)
	logger.setLevel(logging.DEBUG)
	
	return logger
