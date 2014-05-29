//global variable
var app={
	searchResult:null,
	testmode:true,
	map : null,
	initCenterLatLng : [35, -100],
	initCenterZoom : 4,
	basemaps : {
		//"Light map": L.tileLayer("https://tiles.mapbox.com/v3/pathgeo.map-jwxvdo36/{z}/{x}/{y}.png?updated=1374825292888",{attribution:"Map Provided by <a href='http://www.mapbox.com/' target='_blank'>MapBox</a>", title:"Light Map"}),
		//"Terrain map": L.tileLayer("https://tiles.mapbox.com/v3/pathgeo.map-9p1ubd74/{z}/{x}/{y}.png?updated=1374825095067",{attribution:"Map Provided by <a href='http://www.mapbox.com/' target='_blank'>MapBox</a>", title:"Terrain Map"}),
		//"Night map": L.tileLayer("https://tiles.mapbox.com/v3/pathgeo.map-jkiqueqj/{z}/{x}/{y}.png?updated=1374825942470",{attribution:"Map Provided by <a href='http://www.mapbox.com/' target='_blank'>MapBox</a>", title:"Night Map"}),
		"Light Gray Background Map" : L.tileLayer("http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png", {
			styleId : 22677,
			attribution : "Map Provided by <a href='http://cloudmade.com/' target='_blank'>Cloudmade</a>",
			title : "Cloudmade"
		}),
		"OpenStreet Map" : L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution : "Map Provided by <a href='http://www.openstreetmap.org/' target='_blank'>Open Street Map</a>",
			title : "Open Street Map",
			maxZoom:19
		}),
		"ESRI Imagery Map" : L.layerGroup([
			L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "World_Imagery",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Imagery Map"
			}),
			L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "Reference/World_Boundaries_and_Places",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Imagery Map"
			})
		]),
		"ESRI Street Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
			serviceName: "World_Street_Map",
			attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
			title : "ESRI Street Map"
		}),
		"ESRI National Geographic Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
			serviceName: "NatGeo_World_Map",
			attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
			title : "ESRI National Geographic Map",
			maxZoom:16
		}),
		"ESRI Terrain Map" : L.layerGroup([
			L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "World_Terrain_Base",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Terrain Map",
				maxZoom:13
			}),
			L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "Reference/World_Reference_Overlay",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Terrain Map",
				maxZoom:13
			}),
		]),
		"ESRI Topographic Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
			serviceName: "World_Topo_Map",
			attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
			title : "ESRI Topographic Map"
		}),
		"ESRI Light Gray Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
			serviceName: "Canvas/World_Light_Gray_Base",
			attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
			title : "ESRI Light Gray Map",
			maxZoom:16
		}),
		"ESRI Ocean Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
			serviceName: "Ocean_Basemap",
			attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
			title : "ESRI Ocean Map",
			maxZoom:12
		})
		//"Google Streetmap":L.tileLayer("https://mts{s}.googleapis.com/vt?lyrs=m@207265067&src=apiv3&hl=zh-TW&x={x}&y={y}&z={z}&s=Ga&style=api%7Csmartmaps",{subdomains:"123", attribution:"Map Source from Google"})
	}
}





$(function(){
		init_UI();
		//search event
		searchEvent();

		//init map
		$("#page-map").on({
			"pageshow":function(e, ui){
				var $this=$(this);
				
				setTimeout(function(){
					$("#page-map #map").css({height: $this.height()-$this.find(".ui-header").height()-2})
					init_map();
				}, 10);
	
			}
		})
		
		$(window).on({
			"resize":function(){
				
				var $this=$("#page-map");
				$("#page-map #map").css({height: $this.height()-$this.find(".ui-header").height()-2})
				app.map.invalidateSize(); 
			}
			
			
		})
});



/**
 * init UI 
 */
function init_UI(){
	$("body>[data-role='panel']").panel().find("[data-role='listview']").listview();
	
}




/**
 * init map 
 */
function init_map(){

	app.map = L.map("map", {
		center : app.initCenterLatLng,
		zoom : app.initCenterZoom,
		layers : [app.basemaps["ESRI National Geographic Map"]],
		attributionControl : true,
		trackResize : true
	});

	//set up current basemap
	app.map.currentBasemap=app.basemaps["ESRI National Geographic Map"];
	

	//move the location of zoomcontrol to the bottom right
	app.map.zoomControl.setPosition("bottomright");
	
	
	
}










/***
 * searchEvent 
 * @param {String location
 */
function searchEvent(location){
	var url=(app.testmode)?"db/searchEvent.json":"ws/searchEvent.py?location="+location+"&time=&category=";
	
	//search event
	$.getJSON(url, function(json){
		if(json){
			app.searchResult=json;
			
			//generate search list
			showSearchResult(json);
		}	
	});
}




/**
 * showSearchResult 
 * @param {Object} json
 */
function showSearchResult(json){
	var html='',
		length=json.length,
		$target=$("#slider"),
		venue,
		star="<img src='images/1399611719_star.png' alt='Social Rank'/>&nbsp; &nbsp; ";
	

	//read json
	$.each(json, function(i, evt){
		evt.thumbnail=evt.thumbnail || "images/1394974803_plan.png";
		var description=String(evt.description).substr(0, 300) + '.....';
		venue=evt.venue;
		reviews=evt.reviews; 

		//html
		html+="<li>"+
			 	"<img src='"+evt.thumbnail+"'>"+
			 	"<div class='flex-caption'>"+
			 		"<h1>"+evt.name+"</h1>"+
			 		"<p>"+evt.date+", "+evt.time+" @ <a href='"+ ((venue.url&&venue.url!='')?venue.url:"#")+"' target='_blank'>"+venue.name+"</a><br>"+venue.address+"</p>"+
			 		"<div class='socialRank'>"+ (function(count){
			 			//repeat star
			 			if(count>0){
			 				return new Array(count+1).join(star);
			 			}
			 		})(reviews.rank) +"</div>"+
			 	"</div>"+
			 "</li>";
	});
	
	$target.find("ul.slides").html(html);
	$target.flexslider({
		animation: "fade"
	});
}





/**
 * showPopup 
 * @param {Object} obj Event obj
 */
function showPopup(obj){
	var $popup=$("#eventDetail");
	
	//popup title
	$popup.find('.modal-title').html(obj.name);
	
	//popup body
	var html=obj.description;
	$popup.find('.modal-body').html(html)
	
	//show popup
	$('.popup').modal('show');
}


