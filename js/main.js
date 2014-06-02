//global variable
var app={
	searchResult:null,
	testmode:true,
	socket:io.connect("http://www.pathgeo.com:8080/socket-citybuddy"),
	map : null,
	initCenterLatLng : [35, -100],
	initCenterZoom : 4,
	heatmapLayer:null,
	clusterLayer:null,
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
		
		init_map();
		
		
		//init socket
		init_socket();
		

		//search event
		searchEvent();


		
		//when swtich to page-map
		$("#page-map").on({
			"pageshow":function(e, ui){
				var $this=$(this);
			
				setTimeout(function(){
					$("#page-map #map").css({height: $this.height()-$this.find(".ui-header").height()-2})
					//resize the map
					app.map.invalidateSize();

					//if this is first time to switch to map page
					if(app.heatmapLayer.options.visible === undefined || app.clusterLayer.options.visible===undefined){
						//add markercluster adn heatmap on the map
						app.clusterLayer.addTo(app.map).options.visible=true;
						app.heatmapLayer.addTo(app.map).options.visible=true;
					}
				}, 10);
			
			}
		})
		
		
		//when resize the window
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
 * socket 
 */
function init_socket(){
	app.socket.on("connected", function(data){
		console.log(data)
	})
		
	
	app.socket.on("broadcast", function(tweet){
		if(tweet){

			var lat, lng;
			if(tweet.geo && tweet.geo.coordinates){
				lat=tweet.geo.coordinates[0];
				lng=tweet.geo.coordinates[1];
			}else{
				lat=tweet.lat;
				lng=tweet.lon;
			}
					
			if(lat&&lng){
				//app.points.push({lat:lat, lon:lng, value:1});
				//marker
				var marker=new L.Marker(new L.LatLng(lat, lng)),
					point=new L.LatLng(lat, lng);
				
				
				marker.tweet=tweet;
				marker.bindPopup(tweet.text);
				marker.on("click", function(e){
					//embed tweet
					if(e.target && e.target.tweet){
						var t=e.target.tweet,
							html="<blockquote class='twitter-tweet'><p><a href='https://twitter.com/"+t.user.screen_name+"/statuses/"+t.id+"'></a></blockquote>";
						$("#tweetContent").html(html).show();
						twttr.widgets.load();
					}
				});
				
				
				
				app.clusterLayer.addLayer(marker);
				
				//heatmap
				app.heatmapLayer.addLatLng(point);
						
			
				
			}
		}
	});

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
	
	
	//add heatmap layer
	var empty_geojson=[{"type":"Feature", "properties":{}, "geometry":{"type":"Point", "coordinates":[]}}];
	app.heatmapLayer = L.heatLayer([], {radius: 50});
	
	
	//clusterlayer
	app.clusterLayer=pathgeo.layer.markerCluster(null,{},{
			//clusterclick event
			clusterclick : clusterClickHandler
	})
	
	
	//controls
	var controls={
		mapGallery : L.Control.extend({
			options : {
				"collapsed" : true,
				"position" : 'topright',
				"text" : 'Map Gallery'
			},
			initialize : function(options) {
				L.Util.setOptions(this, options);
			},
			onAdd : function(map) {
				// create the control container with a particular class name
				var container = L.DomUtil.create('div', 'leaflet-control-mapGallery');
				var html = "<ul>"+
							"<li title='Cluster Map' layer='clusterLayer' style='background-color:#5B92C0'><img src='images/gallery-cluster.png' /></li>"+
							"<li title='Hotspots' layer='heatmapLayer' style='background-color:#5B92C0'><img src='images/gallery-heatmap.png' /></li>"+
						   "</ul>";


				//click map gallery event
				$(container).html(html).find("ul li").on({
					click : function() {
						var $this = $(this), value = $this.attr("layer"), layer = app[value];
						
						//if this layer is already shown on the map, hide the layer and change the color
						if (layer.options.visible) {
							//hide layers
							//if geoJsonLayer >> hide all _icon. Other layers, remove layer from map
							if(value=='clusterLayer'){  
								$("#tweetContent").hide();
							}
							
							app.map.removeLayer(layer)
					
//							app.map.removeLayer(layer);
							$this.css({"background-color" : ''});
							
							layer.options.visible=false;
						} else {
							
							layer.addTo(app.map)
						
						
							//make the markerclusterlayer more priority
							if(value=='clusterLayer'){
								layer.bringToFront();
								layer.on("clusterclick", clusterClickHandler);
							}
							
							$this.css({"background-color" : "#5B92C0"});

							layer.options.visible=true;
						}
					},
					mouseover : function() {
						// $(".mapPopupWidget, #basemapWidget").hide();
						// var $this = $(this), value = $this.attr("layer"), layer = app.geocodingResult[value];
// 
						// //only the layer is activated
						// if (layer.options.visible) {
							// //show map popup window
							// $("#mapPopup_" + value).show();
						// }
					},
					mouseleave : function() {

					}
				});
				return container
			}
		}),
		tocThumbnail: L.Control.extend({
			options : {
				"position" : 'topright',
				"text" : 'Change Base Maps'
			},
			initialize : function(options) {L.Util.setOptions(this, options);},
			onAdd : function(map) {
				//create div element
				var mainContent=L.DomUtil.create('div', 'leaflet-control-tocThumbnail'),
					html="<a class='leaflet-control-layers-toggle' href='#' title='Layers'></a>"+ $("#basemapWidget")[0].outerHTML;
				
				$(mainContent).html(html)
					.addClass('leaflet-control-layers')
					.on({
						"mouseover":mouseoverEvent,
						"click": mouseoverEvent
					})
					.find("ul li").click(function(){
						switchBaseLayer($(this).attr('title'));
					});

				//monuseoverEvent on the basemapWidget
				function mouseoverEvent(e){
					$("#basemapWidget").show().on({
						"mouseleave":function(){
							$(this).hide();
						}
					});
				}
				
				return mainContent;
			}
		})
	}
	
	
	//add map gallery control
	$.each(controls, function(k,v){
		app.map.addControl(new v());
	})
	
	
	//insert a div, tweetContent
	$("#map").append("<div id='tweetContent'></div>");


}



//switch basemap
function switchBaseLayer(type){
	var layer = app.basemaps[type] || null,
		map=app.map;
	
	if(layer){
		if(app.map.currentBasemap){
			map.removeLayer(app.map.currentBasemap);
		}
		map.addLayer(layer);
		app.map.currentBasemap=layer;
		
		//fire baselayerchange event
		map.fire('baselayerchange', {layer: layer});
	}
}





/**
 * marker cluster click event 
 */
var clusterClickHandler=function(e){
	if(e.layer && e.layer._childCount){
		if(e.layer._childCount >= 101){
			alert("Please zoom in to decrease the number of markers less than 100");
			return; 
		}
	}
	
	//show loading
	$("#tweetContent").html("<img src='images/loading.gif' />").show();
			

			
	var tweets = pathgeo.util.readClusterFeatureProperies(e.layer, [], "tweet");
	var html = "<div class='popup'>There are <b>" + e.layer._childCount + "</b> tweets:<p></p>";
	
	//open popup for the cluster
	e.layer.bindPopup(html, {
		maxWidth : 500,
		maxHeight : 300
	}).openPopup();
				
	//show tweet
	var t_html=""
	$.each(tweets, function(i,t){
		t_html+="<blockquote class='twitter-tweet'><p><a href='https://twitter.com/"+t.user.screen_name+"/statuses/"+t.id+"'></a></blockquote>";
	})
	$("#tweetContent").html(t_html);
	twttr.widgets.load();
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


